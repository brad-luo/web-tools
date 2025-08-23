'use client'

import { useState } from 'react'
import { useTheme } from '../lib/theme-context'
import { FaSun, FaMoon, FaDesktop, FaChevronDown } from 'react-icons/fa'

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const themes = [
    { value: 'light' as const, label: 'Light', icon: FaSun },
    { value: 'dark' as const, label: 'Dark', icon: FaMoon },
    { value: 'system' as const, label: 'System', icon: FaDesktop },
  ]

  const currentTheme = themes.find(t => t.value === theme) || themes[2]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      >
        <currentTheme.icon className="w-4 h-4" />
        <span className="hidden sm:inline">{currentTheme.label}</span>
        <FaChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-20 border border-gray-200 dark:border-gray-700">
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => {
                setTheme(themeOption.value)
                setIsOpen(false)
              }}
              className={`flex items-center w-full text-left px-3 py-2 text-sm transition-colors ${
                theme === themeOption.value
                  ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <themeOption.icon className="w-4 h-4 mr-2" />
              {themeOption.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}