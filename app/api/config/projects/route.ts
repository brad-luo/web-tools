import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '../../../lib/auth'
import { ProjectModel } from '../../../lib/models/project'
import type { ProjectConfig } from '../../../../types'

// GET /api/config/projects - Get all projects from database
export async function GET() {
  try {
    // Get projects from database only
    const dbProjects = await ProjectModel.findAll()

    // Convert database projects to ProjectConfig format
    const projects: ProjectConfig[] = dbProjects.map(project => ({
      id: project.id.toString(),
      name: project.name,
      description: project.description,
      url: project.url,
      icon: project.icon,
      color: project.color,
      category: project.category,
      featured: project.featured
    }))

    return NextResponse.json({
      success: true,
      data: {
        projects: projects,
        categories: {
          'web-development': 'Web Development',
          'open-source': 'Open Source',
          'mobile-app': 'Mobile App',
          'desktop-app': 'Desktop App',
          'api': 'API & Backend',
          'data-science': 'Data Science',
          'machine-learning': 'Machine Learning',
          'devops': 'DevOps',
          'security': 'Security',
          'blockchain': 'Blockchain',
          'iot': 'IoT',
          'game': 'Game Development',
          'design': 'Design',
          'other': 'Other'
        }
      }
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/config/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, url, icon, color, category, featured } = body

    // Validate required fields
    if (!name || !description || !url || !icon || !color || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create project in database
    const project = await ProjectModel.create({
      name,
      description,
      url,
      icon,
      color,
      category,
      featured: featured || false
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Failed to create project' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: project.id.toString(),
        name: project.name,
        description: project.description,
        url: project.url,
        icon: project.icon,
        color: project.color,
        category: project.category,
        featured: project.featured
      }
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
