import Link from 'next/link'
import { ArrowLeft, LucideIcon } from 'lucide-react'

interface ToolHeaderProps {
  title: string
  icon: LucideIcon
  iconColor: string
  description?: string
}

export default function ToolHeader({ title, icon: Icon, iconColor, description }: ToolHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-6">
          <Link href="/" className="flex items-center text-gray-500 hover:text-gray-700 mr-4 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back to Tools</span>
          </Link>
          <div className="flex items-center">
            <div className={`${iconColor} p-2 rounded-lg mr-3`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {description && (
                <p className="text-gray-600 text-sm mt-1">{description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}