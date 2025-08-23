'use client'

import { Github, Linkedin, Twitter } from 'lucide-react'
import type { SocialLink } from '../../types'

// Icon mapping for social links
const iconMap = {
  Github,
  Linkedin, 
  Twitter
}

interface FooterProps {
  tagline?: string
  socialLinks?: SocialLink[]
}

export function Footer({ tagline = "Built with Next.js, Tailwind CSS, and ❤️", socialLinks = [] }: FooterProps) {
  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8">
      <div className="text-center">
        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="flex justify-center space-x-6 mb-6">
            {socialLinks.map((link) => {
              const IconComponent = iconMap[link.icon as keyof typeof iconMap]
              
              if (!IconComponent) return null
              
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  title={`Follow on ${link.name}`}
                >
                  <IconComponent className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                </a>
              )
            })}
          </div>
        )}
        
        {/* Tagline */}
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {tagline}
        </p>
      </div>
    </footer>
  )
}