'use client'

import { ReactNode, useEffect, useState } from 'react'
import { AuthWrapper } from './AuthWrapper'
import type { ToolConfig, ProtectedToolProps } from '../../types'

export function ProtectedTool({ toolId, children }: ProtectedToolProps) {
  const [toolConfig, setToolConfig] = useState<ToolConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchToolConfig = async () => {
      try {
        const response = await fetch(`/api/config/tool/${toolId}`)
        if (response.ok) {
          const config = await response.json()
          setToolConfig(config)
        } else {
          setError('Tool not found')
        }
      } catch (error) {
        setError('Failed to load tool configuration')
      } finally {
        setLoading(false)
      }
    }

    fetchToolConfig()
  }, [toolId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tool...</p>
        </div>
      </div>
    )
  }

  if (error || !toolConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tool Not Found</h2>
          <p className="text-gray-600">{error || 'The requested tool could not be found.'}</p>
        </div>
      </div>
    )
  }

  return (
    <AuthWrapper
      toolId={toolConfig.id}
      toolName={toolConfig.name}
      loginRequired={toolConfig.loginRequired}
    >
      {children}
    </AuthWrapper>
  )
}