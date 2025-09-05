import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '../../../../lib/auth'
import { ProjectModel } from '../../../../lib/models/project'

// GET /api/config/projects/[id] - Get a specific project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id)
    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    const project = await ProjectModel.findById(projectId)
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
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
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PUT /api/config/projects/[id] - Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const projectId = parseInt(params.id)
    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, description, url, icon, color, category, featured } = body

    // Update project in database
    const project = await ProjectModel.update(projectId, {
      name,
      description,
      url,
      icon,
      color,
      category,
      featured
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found or update failed' },
        { status: 404 }
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
    console.error('Error updating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE /api/config/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const projectId = parseInt(params.id)
    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID' },
        { status: 400 }
      )
    }

    const success = await ProjectModel.delete(projectId)
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Project not found or delete failed' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Project deleted successfully' }
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
