import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: 'Web Tools - Useful Online Tools',
  description: 'A collection of useful web tools including URL encoder/decoder, Base64 converter, JSON formatter, text case converter, and color picker.',
  keywords: 'web tools, url encoder, base64, json formatter, text converter, color picker'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <Providers>
          {children}
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
