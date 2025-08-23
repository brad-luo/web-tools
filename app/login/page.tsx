'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { FaGithub, FaGoogle } from 'react-icons/fa'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleLogin = async (provider: string) => {
    setIsLoading(true)
    try {
      await signIn(provider, { callbackUrl: '/' })
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md border dark:border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Web Tools</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Sign in to access useful web development tools</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleLogin('github')}
            disabled={isLoading}
            className="flex items-center justify-center w-full py-3 px-4 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
          >
            <FaGithub className="mr-2" size={20} />
            <span>Sign in with GitHub</span>
          </button>

          <button
            onClick={() => handleLogin('google')}
            disabled={isLoading}
            className="flex items-center justify-center w-full py-3 px-4 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg transition-colors duration-200"
          >
            <FaGoogle className="mr-2 text-red-500" size={20} />
            <span>Sign in with Google</span>
          </button>
        </div>

        {isLoading && (
          <div className="mt-4 text-center text-gray-600 dark:text-gray-300">
            <p>Redirecting to provider...</p>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  )
}
