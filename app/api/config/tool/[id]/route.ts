import { NextRequest, NextResponse } from 'next/server'
import { getToolConfig } from '../../../../lib/config'
import type { ToolsConfig } from '../../../../../types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const toolId = params.id
    
    const defaultConfig: ToolsConfig = {
      tools: [],
      categories: {}
    }

    const config = await getToolConfig<ToolsConfig>('tools', defaultConfig)
    const tool = config.tools.find(t => t.id === toolId)

    if (!tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(tool)
  } catch (error) {
    console.error('Error loading tool configuration:', error)
    return NextResponse.json(
      { error: 'Failed to load tool configuration' },
      { status: 500 }
    )
  }
}