'use client'

import { useEffect, useState } from 'react'
import { useSession, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  User,
  Github,
  Chrome,
  Lock,
  Settings,
  ChevronLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface OAuthAccount {
  id: number
  provider: string
  provider_user_id: string
  created_at: string
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
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
        return <Github className="w-5 h-5" />
      case 'google':
        return <Chrome className="w-5 h-5" />
      default:
        return <Lock className="w-5 h-5" />
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center px-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-lg font-semibold">Account Settings</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security" disabled>Security</TabsTrigger>
            <TabsTrigger value="preferences" disabled>Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* User Profile */}
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={session.user.image || ''} alt={session.user.name || 'User'} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <div className="px-3 py-2 bg-muted rounded-md text-sm">
                          {session.user.name || 'Not provided'}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <div className="px-3 py-2 bg-muted rounded-md text-sm">
                          {session.user.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>
                  OAuth accounts linked to your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {oauthAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {getProviderIcon(account.provider)}
                        <div>
                          <p className="font-medium">
                            {getProviderName(account.provider)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Connected on {formatDate(account.created_at)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">
                        Connected
                      </Badge>
                    </div>
                  ))}

                  {oauthAccounts.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                      No connected accounts found.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Coming soon - manage your security preferences
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>User Preferences</CardTitle>
                <CardDescription>
                  Coming soon - customize your experience
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}