import { getSession } from './lib/auth'
import { getToolConfig } from './lib/config'
import { UserHeader } from './components/UserHeader'
import { ToolsGrid } from './components/ToolsGrid'

// Tool configuration interface (server-side with string icons)
interface ToolConfig {
  id: string
  name: string
  description: string
  icon: string
  href: string
  color: string
  category: string
  loginRequired: boolean
}

interface ToolsConfig {
  tools: ToolConfig[]
  categories: Record<string, string>
}

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

export default async function Home() {
  const session = await getSession()
  const user = session?.user
  const tools = await getToolsConfig()

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
                <h1 className="text-2xl font-bold text-gray-900">Web Tools</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <p className="text-sm text-gray-500">Useful online tools</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A collection of useful online tools to help with common web development tasks.
            Simple, fast, and reliable tools you can use right in your browser.
          </p>
        </div>

        {/* Tools Grid */}
        <ToolsGrid tools={tools} />

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            Built with Next.js, Tailwind CSS, and ❤️
          </p>
        </div>
      </main>
    </div>
  )
}
