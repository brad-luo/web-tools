import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/app/providers'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GoogleTagManager } from '@next/third-parties/google'
import { ThemeScript } from '../components/ThemeScript'
import { AppLayout } from '@/components/AppLayout'

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
      <head>
        <ThemeScript />
      </head>
      <GoogleTagManager gtmId="GTM-TSJZSTP" />
      <body className="min-h-screen no-flash">
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>

  )
}
