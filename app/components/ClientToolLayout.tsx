'use client'

import { ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { LucideIcon } from 'lucide-react'
import { UserHeader } from './UserHeader'
import ToolHeader from './ToolHeader'

interface ClientToolLayoutProps {
  title: string
  icon: LucideIcon
  iconColor: string
  description?: string
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full'
  backgroundColor?: string
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full'
}

export default function ClientToolLayout({ 
  title, 
  icon, 
  iconColor, 
  description, 
  children, 
  maxWidth = '4xl',
  backgroundColor = 'bg-gray-50'
}: ClientToolLayoutProps) {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <div className={`min-h-screen ${backgroundColor}`}>
      <UserHeader user={user} />
      <ToolHeader 
        title={title}
        icon={icon}
        iconColor={iconColor}
        description={description}
      />
      <main className={`${maxWidthClasses[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
        {children}
      </main>
    </div>
  )
}