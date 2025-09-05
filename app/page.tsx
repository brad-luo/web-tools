import { getConfig } from './lib/config'
import { ToolsGrid } from '@/components/ToolsGrid'
import { GamesGrid } from '@/components/GamesGrid'
import { ProjectsGrid } from '@/components/ProjectsGrid'
import { Badge } from '@/components/ui/badge'
import type { ToolsConfig, GamesConfig, HomeConfig } from '../types'

// Get tools configuration
async function getToolsConfig() {
  const defaultConfig: ToolsConfig = {
    tools: [],
    categories: {}
  }

  try {
    const config = await getConfig<ToolsConfig>('tools', defaultConfig)
    // Return tools with icon strings (not components) for client-side mapping
    return config.tools
  } catch (error) {
    console.error('Failed to load tools configuration:', error)
    return []
  }
}

// Get games configuration
async function getGamesConfig() {
  const defaultConfig: GamesConfig = {
    games: [],
    categories: {}
  }

  try {
    const config = await getConfig<GamesConfig>('games', defaultConfig)
    // Return games with icon strings (not components) for client-side mapping
    return config.games
  } catch (error) {
    console.error('Failed to load games configuration:', error)
    return []
  }
}

// Get projects from database via API
async function getProjectsConfig() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/config/projects`, {
      cache: 'no-store' // Ensure fresh data from database
    })

    if (!response.ok) {
      throw new Error('Failed to fetch projects')
    }

    const data = await response.json()
    return data.success ? data.data.projects : []
  } catch (error) {
    console.error('Failed to load projects from database:', error)
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
    const config = await getConfig<HomeConfig>('home', defaultConfig)
    return config
  } catch (error) {
    console.error('Failed to load home configuration:', error)
    return defaultConfig
  }
}

export default async function Home() {
  const tools = await getToolsConfig()
  const games = await getGamesConfig()
  const projects = await getProjectsConfig()
  const homeConfig = await getHomeConfig()

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {homeConfig.hero.description}
        </p>
      </div>

      {/* Tools Section */}
      <section className="mb-16">
        <div className="flex items-center mb-8">
          <h2 className="text-2xl font-bold">Tools</h2>
          <Badge variant="outline" className="ml-4 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
            {tools.length} tools
          </Badge>
        </div>
        <ToolsGrid tools={tools} />
      </section>

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <h2 className="text-2xl font-bold">Projects</h2>
            <Badge variant="outline" className="ml-4 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
              {projects.length} projects
            </Badge>
          </div>
          <ProjectsGrid projects={projects} />
        </section>
      )}

      {/* Games Section */}
      {games.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <h2 className="text-2xl font-bold">Games</h2>
            <Badge variant="outline" className="ml-4 bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
              {games.length} games
            </Badge>
          </div>
          <GamesGrid games={games} />
        </section>
      )}

    </div>
  )
}
