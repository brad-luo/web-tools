import { getSession } from './lib/auth'
import { getToolConfig } from './lib/config'
import { UserHeader } from './components/UserHeader'
import { ToolsGrid } from './components/ToolsGrid'
import { Footer } from './components/Footer'
import type { ToolsConfig, HomeConfig } from '../types'

// Get tools configuration
async function getToolsConfig() {
  const defaultConfig: ToolsConfig = {
    tools: [],
    categories: {}
  }

  try {
    const config = await getToolConfig<ToolsConfig>('tools', defaultConfig)
    // Return tools with icon strings (not components) for client-side mapping
    return config.tools
  } catch (error) {
    console.error('Failed to load tools configuration:', error)
    return []
  }
}

// Get home page configuration
async function getHomeConfig() {
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
    const config = await getToolConfig<HomeConfig>('home', defaultConfig)
    return config
  } catch (error) {
    console.error('Failed to load home configuration:', error)
    return defaultConfig
  }
}

export default async function Home() {
  const session = await getSession()
  const user = session?.user
  const tools = await getToolsConfig()
  const homeConfig = await getHomeConfig()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* User Header */}
      <UserHeader user={user} />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">{homeConfig.hero.title}</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <p className="text-sm text-gray-500">{homeConfig.hero.subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {homeConfig.hero.description}
          </p>
        </div>

        {/* Tools Grid */}
        <ToolsGrid tools={tools} />

        {/* Footer */}
        <Footer 
          tagline={homeConfig.footer.tagline}
          socialLinks={homeConfig.footer.socialLinks}
        />
      </main>
    </div>
  )
}
