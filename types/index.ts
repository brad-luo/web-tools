/**
 * Shared type definitions for the Web Tools application
 * 
 * This file centralizes type definitions to prevent duplication
 * and ensure consistency across the application.
 */

// Core tool configuration interface
export interface ToolConfig {
  id: string
  name: string
  description: string
  icon: string
  href: string
  color: string
  category: string
  loginRequired: boolean
  recommended: boolean
}

// Tools configuration container
export interface ToolsConfig {
  tools: ToolConfig[]
  categories: Record<string, string>
}

// Core game configuration interface  
export interface GameConfig {
  id: string
  name: string
  description: string
  icon: string
  href: string
  color: string
  category: string
  featured: boolean
  screenshots?: string[]
  controls?: string[]
}

// Games configuration container
export interface GamesConfig {
  games: GameConfig[]
  categories: Record<string, string>
}

// Core project configuration interface
export interface ProjectConfig {
  id: string
  name: string
  description: string
  url: string
  icon: string
  color: string
  category: string
  featured: boolean
}

// Projects configuration container
export interface ProjectsConfig {
  projects: ProjectConfig[]
  categories: Record<string, string>
}

// Calendar-specific types
export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  description?: string
  location?: string
  calendarName: string
  calendarColor: string
}

export interface CalendarSource {
  id: string
  name: string
  url: string
  color: string
}

export interface CalendarConfig {
  defaultCalendars: CalendarSource[]
  colorPalette: string[]
}

// User session types (extending NextAuth)
export interface User {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export interface Session {
  user?: User
  expires: string
}

// Component prop types
export interface ToolsGridProps {
  tools: ToolConfig[]
}

export interface GamesGridProps {
  games: GameConfig[]
}

export interface ProjectsGridProps {
  projects: ProjectConfig[]
}

export interface HeaderProps {
  user?: User | null
  title: string
}

export interface ProtectedToolProps {
  toolId: string
  children: React.ReactNode
}

export interface LoginRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  toolName: string
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

// Home page configuration types
export interface SocialLink {
  name: string
  url: string
  icon: string
}

export interface HomeConfig {
  hero: {
    title: string
    subtitle: string
    description: string
  }
  footer: {
    tagline: string
    socialLinks: SocialLink[]
  }
  seo: {
    title: string
    description: string
    keywords: string[]
  }
}

// Configuration loading types
export type ConfigLoader<T> = (configName: string, defaultConfig: T) => Promise<T>