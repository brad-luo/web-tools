'use client'

import Link from 'next/link'
import {
  Gamepad2,
  Play,
  ArrowRight,
  Star,
  ExternalLink
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { GameConfig } from '../types'

// Icon mapping for games
const gameIconMap = {
  Gamepad2,
  Play
}

interface GamesGridProps {
  games: GameConfig[]
}

export function GamesGrid({ games }: GamesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => {
        const IconComponent = gameIconMap[game.icon as keyof typeof gameIconMap] || Gamepad2

        return (
          <Link
            key={game.id}
            href={game.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block h-full"
          >
            <Card className="group-hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-2 group-hover:border-yellow-200 dark:group-hover:border-yellow-600 h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start space-x-4">
                  <div className={`${game.color} p-3 rounded-lg text-white relative`}>
                    <IconComponent className="w-6 h-6" />
                    {game.featured && (
                      <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                        <Star className="w-3 h-3 text-yellow-800 fill-current" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{game.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {game.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 flex-1 flex flex-col">
                {/* Controls section */}
                <div className="flex-1">
                  {game.controls && game.controls.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                        How to Play:
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {game.controls.slice(0, 2).map((control, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-yellow-500 dark:text-yellow-400 mr-1">•</span>
                            {control}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center text-yellow-600 dark:text-yellow-400 font-medium text-sm group-hover:text-yellow-700 dark:group-hover:text-yellow-300">
                    Play Now
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="flex items-center space-x-2">
                    {game.featured && (
                      <Badge variant="secondary" className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">
                        Featured
                      </Badge>
                    )}
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
