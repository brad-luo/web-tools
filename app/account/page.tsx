'use client'

import { useEffect, useState } from 'react'
import { useSession, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FaUser, 
  FaGithub, 
  FaGoogle, 
  FaLock,
  FaCog
} from 'react-icons/fa'

interface OAuthAccount {
  id: number
  provider: string
  provider_user_id: string
  created_at: string
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('general')
  const [oauthAccounts, setOAuthAccounts] = useState<OAuthAccount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchOAuthAccounts()
    }
  }, [status, router])

  const fetchOAuthAccounts = async () => {
    try {
      const response = await fetch('/api/user/oauth-accounts')
      if (response.ok) {
        const accounts = await response.json()
        setOAuthAccounts(accounts)
      }
    } catch (error) {
      console.error('Failed to fetch OAuth accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'github':
        return <FaGithub className="w-5 h-5" />
      case 'google':
        return <FaGoogle className="w-5 h-5" />
      default:
        return <FaLock className="w-5 h-5" />
    }
  }

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'github':
        return 'GitHub'
      case 'google':
        return 'Google'
      default:
        return provider.charAt(0).toUpperCase() + provider.slice(1)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const sidebarTabs = [
    { id: 'general', name: 'General', icon: FaUser },
    { id: 'security', name: 'Security', icon: FaLock, disabled: true },
    { id: 'preferences', name: 'Preferences', icon: FaCog, disabled: true },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Account Settings
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-64">
            <nav className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-1">
              {sidebarTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setActiveTab(tab.id)}
                  disabled={tab.disabled}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                      : tab.disabled
                      ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-3" />
                  {tab.name}
                  {tab.disabled && (
                    <span className="ml-auto text-xs text-gray-400">Soon</span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {activeTab === 'general' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    General Information
                  </h2>

                  {/* User Profile */}
                  <div className="mb-8">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      Profile
                    </h3>
                    <div className="flex items-start space-x-4">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          width={64}
                          height={64}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white">
                          <FaUser className="w-6 h-6" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Name
                            </label>
                            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white">
                              {session.user.name || 'Not provided'}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Email
                            </label>
                            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white">
                              {session.user.email}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connected Accounts */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      Connected Accounts
                    </h3>
                    <div className="space-y-3">
                      {oauthAccounts.map((account) => (
                        <div
                          key={account.id}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex items-center space-x-3">
                            {getProviderIcon(account.provider)}
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {getProviderName(account.provider)}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Connected on {formatDate(account.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                              Connected
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {oauthAccounts.length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          No connected accounts found.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}