'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  Link as LinkIcon,
  FileText,
  Type,
  Braces,
  Palette,
  Code2,
  Calendar,
  ArrowRight,
  MessageCircle,
  Star
} from 'lucide-react'
import { LoginRequiredModal } from '@/components/LoginRequiredModal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ToolConfig, ToolsGridProps } from '@/types'

// Icon mapping for client-side use
const iconMap = {
  MessageCircle,
  LinkIcon,
  FileText,
  Braces,
  Type,
  Palette,
  Code2,
  Calendar
}

export function ToolsGrid({ tools }: ToolsGridProps) {
  const { data: session } = useSession()
  const [selectedTool, setSelectedTool] = useState<ToolConfig | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleToolClick = (e: React.MouseEvent, tool: ToolConfig) => {
    // If tool requires login and user is not authenticated, show modal
    if (tool.loginRequired && !session) {
      e.preventDefault()
      setSelectedTool(tool)
      setShowModal(true)
      return
    }
    // Otherwise, let the link work normally
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const IconComponent = iconMap[tool.icon as keyof typeof iconMap] || FileText

          return (
            <Link
              key={tool.name}
              href={tool.href}
              className="group block h-full"
              onClick={(e) => handleToolClick(e, tool)}
            >
              <Card className="group-hover:shadow-lg transition-all duration-200 hover:scale-[1.02] h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-4">
                    <div className={`${tool.color} p-3 rounded-lg text-white relative`}>
                      <IconComponent className="w-6 h-6" />
                      {tool.recommended && (
                        <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                          <Star className="w-3 h-3 text-yellow-800 fill-current" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {tool.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 flex-1 flex flex-col justify-end">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-primary font-medium text-sm group-hover:text-primary/80">
                      Try it now
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                    {tool.loginRequired && (
                      <Badge variant="secondary" className="text-xs">
                        Login Required
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {selectedTool && (
        <LoginRequiredModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setSelectedTool(null)
          }}
          toolName={selectedTool.name}
        />
      )}
    </>
  )
}