import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/app/providers'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GoogleTagManager } from '@next/third-parties/google'
import { ThemeScript } from '../components/ThemeScript'
import { AppLayout } from '@/components/AppLayout'
import { getConfig } from './lib/config'
import type { HomeConfig } from '../types'

const defaultHomeConfig: HomeConfig = {
  hero: {
    title: "Brad Luo",
    subtitle: "Software Engineer & Builder",
    description: "Personal hub for tools, projects, and experiments — built by Brad Luo."
  },
  footer: {
    tagline: "Built by Brad Luo with Next.js, Tailwind CSS, and ❤️",
    socialLinks: []
  },
  seo: {
    title: "Brad Luo — Tools, Projects & Experiments",
    description: "Personal site of Brad Luo — Senior Software Engineer. Tools, projects, games, and experiments in full-stack development, GenAI, and cloud-native systems.",
    keywords: ["Brad Luo", "software engineer", "full-stack developer", "GenAI", "web tools", "portfolio"]
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const homeConfig = await getConfig<HomeConfig>('home', defaultHomeConfig)
  return {
    title: homeConfig.seo.title,
    description: homeConfig.seo.description,
    keywords: homeConfig.seo.keywords.join(', '),
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const homeConfig = await getConfig<HomeConfig>('home', defaultHomeConfig)

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <GoogleTagManager gtmId="GTM-TSJZSTP" />
      <body className="min-h-screen no-flash">
        <Providers>
          <AppLayout
            footerTagline={homeConfig.footer.tagline}
            footerSocialLinks={homeConfig.footer.socialLinks}
          >
            {children}
          </AppLayout>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
