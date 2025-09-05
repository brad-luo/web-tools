import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { streamText, convertToModelMessages } from 'ai'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/auth-config'
import { getDatabase } from '../../lib/db'

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function POST(req: Request) {
  // Check authentication
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { messages, model = 'claude-3-5-sonnet-20241022' } = await req.json()

  // Check daily message limit
  try {
    const sql = getDatabase()
    const today = new Date().toISOString().split('T')[0]

    const result = await sql`SELECT message_count FROM ai_chat_usage WHERE user_email = ${session.user.email} AND date = ${today}` as any[]

    const currentCount = result[0]?.message_count || 0

    if (currentCount >= 10) {
      return new Response(JSON.stringify({
        error: 'Daily message limit of 10 reached. Try again tomorrow.'
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Increment usage counter
    await sql`
      INSERT INTO ai_chat_usage (user_email, date, message_count)
      VALUES (${session.user.email}, ${today}, 1)
      ON CONFLICT (user_email, date)
      DO UPDATE SET message_count = ai_chat_usage.message_count + 1
    `

  } catch (error) {
    console.error('Error checking message limit:', error)
    return new Response('Internal server error', { status: 500 })
  }

  // Choose the appropriate provider based on model
  let selectedModel
  if (model.startsWith('gpt-') || model.startsWith('o1-')) {
    selectedModel = openai(model)
  } else if (model.startsWith('claude-')) {
    selectedModel = anthropic(model)
  } else if (model.startsWith('gemini-')) {
    selectedModel = google(model)
  } else {
    // Default to OpenAI GPT-4o mini
    selectedModel = openai('gpt-4o-mini')
  }

  const result = await streamText({
    model: selectedModel,
    messages: convertToModelMessages(messages),
    maxOutputTokens: 4000,
    temperature: 0.7,
  })

  return result.toTextStreamResponse()
}