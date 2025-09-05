'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Github, Chrome } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Web Tools</CardTitle>
          <CardDescription className="mt-2">
            Sign in to access useful web development tools
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            onClick={() => handleLogin('github')}
            disabled={isLoading}
            variant="default"
            className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700"
            size="lg"
          >
            <Github className="mr-2 h-5 w-5" />
            Sign in with GitHub
          </Button>

          <Button
            onClick={() => handleLogin('google')}
            disabled={isLoading}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Chrome className="mr-2 h-5 w-5 text-red-500" />
            Sign in with Google
          </Button>

          {isLoading && (
            <div className="text-center text-muted-foreground">
              <p>Redirecting to provider...</p>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
