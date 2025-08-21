import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { UserHeader } from './components/UserHeader'
import { auth } from './auth'

export const metadata: Metadata = {
  title: 'Web Tools - Useful Online Tools',
  description: 'A collection of useful web tools including URL encoder/decoder, Base64 converter, JSON formatter, text case converter, and color picker.',
  keywords: 'web tools, url encoder, base64, json formatter, text converter, color picker',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Providers>
          {session?.user && <UserHeader user={session.user} />}
          {children}
        </Providers>
      </body>
    </html>
  )
}
