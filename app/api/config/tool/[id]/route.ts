import { NextRequest, NextResponse } from 'next/server'
import { getConfig } from '../../../../lib/config'
import type { ToolsConfig } from '../../../../../types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const toolId = params.id

    // First, get the tool definition from tools config
    const defaultToolsConfig: ToolsConfig = {
      tools: [],
      categories: {}
    }

    const toolsConfig = await getConfig<ToolsConfig>('tools', defaultToolsConfig)
    const tool = toolsConfig.tools.find(t => t.id === toolId)

    if (!tool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      )
    }

    // Load tool-specific configuration
    let toolConfig = null

    try {
      toolConfig = await getConfig(toolId, {})
    } catch (error) {
      console.warn(`Failed to load config for tool ${toolId}:`, error)
      toolConfig = {}
    }

    return NextResponse.json({
      tool,
      config: toolConfig
    })
  } catch (error) {
    console.error('Error loading tool configuration:', error)
    return NextResponse.json(
      { error: 'Failed to load tool configuration' },
      { status: 500 }
    )
  }
}