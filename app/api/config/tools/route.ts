import { NextResponse } from 'next/server'
import { getToolConfig } from '../../../lib/config'

const defaultConfig = {
  tools: [],
  categories: {}
}

export async function GET() {
  try {
    const config = await getToolConfig('tools', defaultConfig)
    return NextResponse.json(config)
  } catch (error) {
    console.error('Failed to load tools configuration:', error)
    return NextResponse.json(defaultConfig, { status: 500 })
  }
}
