'use client'

import { useRouter } from 'next/navigation'

interface LoginRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  toolName: string
}

export function LoginRequiredModal({ isOpen, onClose, toolName }: LoginRequiredModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  const handleLogin = () => {
    router.push('/login')
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Login Required
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          The <strong>{toolName}</strong> tool requires you to be logged in. 
          Would you like to login now?
        </p>
        <div className="flex space-x-4">
          <button
            onClick={handleLogin}
            className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Yes, Login
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}