'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { LoginRequiredModal } from './LoginRequiredModal'

interface AuthWrapperProps {
  children: React.ReactNode
  toolId: string
  toolName: string
  loginRequired: boolean
}

export function AuthWrapper({ children, toolId, toolName, loginRequired }: AuthWrapperProps) {
  const { data: session, status } = useSession()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (loginRequired && status === 'unauthenticated') {
      setShowModal(true)
    }
  }, [loginRequired, status])

  // Show loading while session is being fetched
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If login is required but user is not authenticated, show modal and placeholder
  if (loginRequired && !session) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">
              The {toolName} tool requires you to be logged in to use it.
            </p>
          </div>
        </div>
        <LoginRequiredModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          toolName={toolName}
        />
      </>
    )
  }

  // If no login required or user is authenticated, show the tool
  return <>{children}</>
}