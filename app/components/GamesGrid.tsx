'use client'

import Link from 'next/link'
import {
  Gamepad2,
  Play,
  ArrowRight,
  Star,
  ExternalLink
} from 'lucide-react'
import type { GameConfig } from '../../types'

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
            className="group"
          >
            <div className="game-card group-hover:shadow-lg transition-all duration-200 border-2 border-transparent group-hover:border-yellow-200">
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {game.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {game.description}
                  </p>

                  {/* Controls section */}
                  {game.controls && game.controls.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                        How to Play:
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {game.controls.slice(0, 2).map((control, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-yellow-500 mr-1">•</span>
                            {control}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-yellow-600 font-medium text-sm group-hover:text-yellow-700">
                      Play Now
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="flex items-center space-x-2">
                      {game.featured && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
