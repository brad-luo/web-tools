'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import {
  Image,
  Workflow,
  SquareStack,
  ExternalLink,
  Star,
  Globe,
  Code,
  Github,
  Zap,
  Rocket,
  Layers,
  Database,
  Smartphone,
  Monitor,
  Server,
  Cloud,
  Shield,
  Cpu,
  Puzzle,
  Target,
  Users
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ProjectConfig } from '../types'

interface ProjectsGridProps {
  projects: ProjectConfig[]
}

// Efficient icon mapping - using actual components instead of functions
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Workflow': Workflow,
  'Image': Image,
  'SquareStack': SquareStack,
  'Globe': Globe,
  'Code': Code,
  'Github': Github,
  'Zap': Zap,
  'Rocket': Rocket,
  'Layers': Layers,
  'Database': Database,
  'Smartphone': Smartphone,
  'Monitor': Monitor,
  'Server': Server,
  'Cloud': Cloud,
  'Shield': Shield,
  'Cpu': Cpu,
  'Puzzle': Puzzle,
  'Target': Target,
  'Users': Users,
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  // Memoize the projects rendering to avoid unnecessary re-renders
  const renderedProjects = useMemo(() => {
    return projects.map((project) => {
      const IconComponent = iconMap[project.icon] || ExternalLink

      return (
        <Link
          key={project.id}
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block h-full"
        >
          <Card className="hover:shadow-md transition-all duration-200 hover:scale-105 overflow-hidden h-full flex flex-col min-h-[200px] max-h-[300px]">
            {/* Project Header */}
            <div className={`${project.color} p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-white">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-gray-100 transition-colors flex items-center">
                      {project.name}
                      {project.featured && (
                        <Star className="w-4 h-4 text-yellow-300 fill-current ml-2" />
                      )}
                    </h3>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Project Content */}
            <CardContent className="p-4 flex-1 flex flex-col min-h-0">
              <div className="text-muted-foreground text-sm leading-relaxed flex-1 whitespace-pre-line overflow-y-auto scrollbar-thin">
                {project.description}
              </div>

              {/* Project Category */}
              <div className="mt-3 flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {project.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  External Link
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      )
    })
  }, [projects])

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-600 mb-4">
          <ExternalLink className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Projects Yet</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Projects will appear here once they are added to the database.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {renderedProjects}
    </div>
  )
}
