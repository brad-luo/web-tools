import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth'
import { getDatabase } from '../../../lib/db'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sql = getDatabase()
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format

    // Get or create today's usage record
    const result = await sql`SELECT message_count FROM ai_chat_usage WHERE user_email = ${session.user.email} AND date = ${today}` as any[]

    const messageCount = result[0]?.message_count || 0
    const remaining = Math.max(0, 10 - messageCount)

    return NextResponse.json({
      used: messageCount,
      remaining,
      limit: 10,
      canSend: remaining > 0
    })
  } catch (error) {
    console.error('Error checking message limit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sql = getDatabase()
    const today = new Date().toISOString().split('T')[0]

    // Check current usage
    const checkResult = await sql`SELECT message_count FROM ai_chat_usage WHERE user_email = ${session.user.email} AND date = ${today}` as any[]

    const currentCount = checkResult[0]?.message_count || 0

    if (currentCount >= 10) {
      return NextResponse.json({
        error: 'Daily message limit reached',
        used: currentCount,
        limit: 10
      }, { status: 429 })
    }

    // Increment usage
    await sql`
      INSERT INTO ai_chat_usage (user_email, date, message_count)
      VALUES (${session.user.email}, ${today}, 1)
      ON CONFLICT (user_email, date)
      DO UPDATE SET message_count = ai_chat_usage.message_count + 1
    `

    const newCount = currentCount + 1

    return NextResponse.json({
      success: true,
      used: newCount,
      remaining: 10 - newCount,
      limit: 10
    })
  } catch (error) {
    console.error('Error updating message count:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}