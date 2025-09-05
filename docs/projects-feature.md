# Projects Feature

## Overview

The Projects feature adds a third category to the Web Tools application, allowing users to showcase their personal projects alongside tools and games. Projects are stored in the database and can be managed through API endpoints.

## Features

- **Database Storage**: Projects are stored in a PostgreSQL database with full CRUD operations
- **Grid Display**: Projects are displayed in a responsive grid layout similar to tools and games
- **External Links**: All projects link to external URLs (GitHub, live demos, etc.)
- **Featured Projects**: Projects can be marked as featured and will be highlighted
- **Categories**: Projects support categorization for better organization
- **Authentication**: Project management requires user authentication

## Database Schema

The projects table includes the following fields:

```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  url VARCHAR(500) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  color VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Project Model

The `ProjectModel` class provides the following methods:

- `findAll()` - Get all projects ordered by featured status and creation date
- `findById(id)` - Get a specific project by ID
- `create(data)` - Create a new project
- `update(id, data)` - Update an existing project
- `delete(id)` - Delete a project
- `findByCategory(category)` - Get projects by category
- `findFeatured()` - Get only featured projects

## API Endpoints

### GET /api/config/projects
Get all projects from database

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [...],
    "categories": {...}
  }
}
```

### POST /api/config/projects
Create a new project (requires authentication)

**Request Body:**
```json
{
  "name": "Project Name",
  "description": "Project description",
  "url": "https://example.com",
  "icon": "Globe",
  "color": "bg-blue-500",
  "category": "web-development",
  "featured": false
}
```

### GET /api/config/projects/[id]
Get a specific project by ID

### PUT /api/config/projects/[id]
Update a project (requires authentication)

### DELETE /api/config/projects/[id]
Delete a project (requires authentication)

## Database Setup

Projects are stored in the database. Use the provided SQL script to create the table:

```sql
-- Run the projects-table.sql script to create the projects table
-- This will create the table with proper indexes and example data
```

## Icons

The following icons are supported in the ProjectsGrid component:

- Globe, Code, Github, ExternalLink, Star, Zap, Rocket
- Layers, Database, Smartphone, Monitor, Server, Cloud
- Shield, Cpu, Wrench, Puzzle, Target, TrendingUp, Users

## Colors

Projects support Tailwind CSS color classes:

- `bg-blue-500`, `bg-green-500`, `bg-purple-500`, `bg-red-500`
- `bg-orange-500`, `bg-pink-500`, `bg-indigo-500`, `bg-gray-500`
- And other Tailwind color variants

## Usage

### Adding Projects via API

```javascript
// Create a new project
const response = await fetch('/api/config/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'My Awesome Project',
    description: 'A description of my project',
    url: 'https://github.com/username/project',
    icon: 'Github',
    color: 'bg-green-500',
    category: 'open-source',
    featured: true
  })
});
```

### Displaying Projects

Projects are automatically displayed on the main page when the `ProjectsGrid` component is included and projects are available. The component handles:

- Responsive grid layout
- External link opening
- Featured project highlighting
- Category display
- Icon rendering

## Integration

The projects feature integrates seamlessly with the existing application:

1. **Main Page**: Projects section appears after games section
2. **Database**: Uses the same Neon PostgreSQL database as other features
3. **Authentication**: Uses the same NextAuth session system
4. **Styling**: Consistent with tools and games styling
5. **API-First**: Projects are fetched from the database via API endpoints

## Future Enhancements

Potential future improvements:

- Project screenshots/gallery
- Project tags for better filtering
- Project status (active, archived, etc.)
- Project metrics (stars, downloads, etc.)
- Project search and filtering
- Project management UI for authenticated users
