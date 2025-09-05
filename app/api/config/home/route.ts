import { NextResponse } from 'next/server'
import { getConfig } from '../../../lib/config'
import type { HomeConfig } from '../../../../types'

export async function GET() {
  const defaultConfig: HomeConfig = {
    hero: {
      title: "Web Tools",
      subtitle: "Useful online tools",
      description: "A collection of useful online tools to help with common web development tasks. Simple, fast, and reliable tools you can use right in your browser."
    },
    footer: {
      tagline: "Built with Next.js, Tailwind CSS, and ❤️",
      socialLinks: []
    },
    seo: {
      title: "Web Tools - Useful Online Tools",
      description: "A collection of useful online tools for web developers.",
      keywords: ["web tools", "online tools", "developer tools"]
    }
  }

  try {
    const config = await getConfig<HomeConfig>('home', defaultConfig)
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error loading home configuration:', error)
    return NextResponse.json(defaultConfig)
  }
}