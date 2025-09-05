'use client'

import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

// Page title mapping
const pageTitles: Record<string, string> = {
  '/': 'Web Tools',
  '/tools/url-encoder': 'URL Encoder/Decoder',
  '/tools/base64-converter': 'Base64 Converter',
  '/tools/json-formatter': 'JSON Formatter',
  '/tools/text-converter': 'Text Case Converter',
  '/tools/color-picker': 'Color Picker & Converter',
  '/tools/markdown-editor': 'Markdown Editor',
  '/tools/calendar-dashboard': 'Calendar Dashboard',
  '/tools/ai-chat': 'AI Chat',
  '/account': 'Account Settings',
  '/login': 'Login',
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  // Get the title for the current page
  const pageTitle = pageTitles[pathname] || 'Web Tools'

  return (
    <div className="min-h-screen bg-background">
      <Header user={session?.user} title={pageTitle} isAuthenticating={status === 'loading'} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
