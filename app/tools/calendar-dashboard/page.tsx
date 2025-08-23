'use client'

import { useState, useEffect, useCallback } from 'react'
import { Calendar, Plus, Clock, MapPin, Trash2, RefreshCw, Edit2, RotateCcw } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ClientToolLayout from '../../components/ClientToolLayout'
import { ProtectedTool } from '../../components/ProtectedTool'
import type { CalendarEvent, CalendarSource } from '../../../types'

// @ts-ignore - ical.js doesn't have TypeScript definitions
import ICAL from 'ical.js'

const TIME_RANGES = [
  { label: '1 Week', days: 7 },
  { label: '1 Month', days: 30 },
  { label: '3 Months', days: 90 },
  { label: '6 Months', days: 180 },
  { label: '1 Year', days: 365 }
]

function CalendarDashboard() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [calendars, setCalendars] = useState<CalendarSource[]>([])
  const [colorPalette, setColorPalette] = useState<string[]>([
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'
  ])
  const [loading, setLoading] = useState(false)
  const [selectedRange, setSelectedRange] = useState(TIME_RANGES[1]) // Default to 1 month
  const [newCalendarName, setNewCalendarName] = useState('')
  const [newCalendarUrl, setNewCalendarUrl] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCalendar, setEditingCalendar] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editUrl, setEditUrl] = useState('')
  const [defaultCalendars, setDefaultCalendars] = useState<CalendarSource[]>([])

  // Storage key for user's calendar settings
  const STORAGE_KEY = 'calendar-dashboard-settings'

  // Helper function to normalize URLs for duplicate detection
  const normalizeUrl = (url: string): string => {
    return url.trim().replace(/\/$/, '').toLowerCase().replace('webcal://', 'https://')
  }

  // Check for duplicates in real-time
  const isDuplicateName = (name: string, excludeId?: string): boolean => {
    if (!name.trim()) return false
    return calendars.some(cal => 
      cal.id !== excludeId && 
      cal.name.toLowerCase() === name.trim().toLowerCase()
    )
  }

  const isDuplicateUrl = (url: string, excludeId?: string): boolean => {
    if (!url.trim()) return false
    return calendars.some(cal => 
      cal.id !== excludeId && 
      normalizeUrl(cal.url) === normalizeUrl(url)
    )
  }

  // Load configuration and user settings on component mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config/calendars')
        if (response.ok) {
          const config = await response.json()
          setDefaultCalendars(config.defaultCalendars)
          setColorPalette(config.colorPalette)

          // Load user's saved settings or use defaults
          const savedSettings = localStorage.getItem(STORAGE_KEY)
          if (savedSettings) {
            try {
              const { calendars: savedCalendars } = JSON.parse(savedSettings)
              setCalendars(savedCalendars)
            } catch (e) {
              console.warn('Invalid saved settings, using defaults')
              setCalendars(config.defaultCalendars)
            }
          } else {
            setCalendars(config.defaultCalendars)
          }
        } else {
          console.warn('Failed to load calendar configuration, using defaults')
        }
      } catch (error) {
        console.error('Error loading calendar configuration:', error)
      }
    }
    loadConfig()
  }, [])

  // Save settings to localStorage whenever calendars change
  useEffect(() => {
    if (calendars.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ calendars }))
    }
  }, [calendars])

  const fetchCalendarData = useCallback(async (calendar: CalendarSource): Promise<CalendarEvent[]> => {
    try {
      // Convert webcal:// to https://
      const url = calendar.url.replace('webcal://', 'https://')

      // Use a CORS proxy for fetching calendar data
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`

      const response = await fetch(proxyUrl)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const icalData = await response.text()

      // Parse iCalendar data
      const jcalData = ICAL.parse(icalData)
      const comp = new ICAL.Component(jcalData)
      const vevents = comp.getAllSubcomponents('vevent')

      const now = new Date()
      const endDate = new Date(now.getTime() + selectedRange.days * 24 * 60 * 60 * 1000)

      const calendarEvents: CalendarEvent[] = vevents.map((vevent: any) => {
        const event = new ICAL.Event(vevent)
        const startDate = event.startDate ? event.startDate.toJSDate() : new Date()
        const endDate = event.endDate ? event.endDate.toJSDate() : startDate

        return {
          id: `${calendar.id}-${event.uid || Math.random()}`,
          title: event.summary || 'Untitled Event',
          start: startDate,
          end: endDate,
          description: event.description || '',
          location: event.location || '',
          calendarName: calendar.name,
          calendarColor: calendar.color
        }
      }).filter((event: CalendarEvent) => {
        // Filter events within the selected time range
        return event.start >= now && event.start <= endDate
      })

      return calendarEvents
    } catch (error) {
      console.error(`Error fetching calendar ${calendar.name}:`, error)
      toast.error(`Failed to load ${calendar.name}`)
      return []
    }
  }, [selectedRange])

  const loadAllCalendars = useCallback(async () => {
    setLoading(true)
    try {
      const allEvents: CalendarEvent[] = []

      for (const calendar of calendars) {
        const calendarEvents = await fetchCalendarData(calendar)
        allEvents.push(...calendarEvents)
      }

      // Sort events by start time
      allEvents.sort((a, b) => a.start.getTime() - b.start.getTime())
      setEvents(allEvents)
      toast.success(`Loaded ${allEvents.length} events`)
    } catch (error) {
      console.error('Error loading calendars:', error)
      toast.error('Failed to load calendars')
    } finally {
      setLoading(false)
    }
  }, [calendars, fetchCalendarData])

  const addCalendar = () => {
    if (!newCalendarName.trim() || !newCalendarUrl.trim()) {
      toast.error('Please provide both name and URL')
      return
    }

    const trimmedName = newCalendarName.trim()
    const trimmedUrl = newCalendarUrl.trim()

    // Check for duplicate names
    if (calendars.some(cal => cal.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast.error('A calendar with this name already exists')
      return
    }

    // Check for duplicate URLs (normalized)
    if (calendars.some(cal => normalizeUrl(cal.url) === normalizeUrl(trimmedUrl))) {
      toast.error('A calendar with this URL already exists')
      return
    }

    const newCalendar: CalendarSource = {
      id: Date.now().toString(),
      name: trimmedName,
      url: trimmedUrl,
      color: colorPalette[calendars.length % colorPalette.length]
    }

    setCalendars([...calendars, newCalendar])
    setNewCalendarName('')
    setNewCalendarUrl('')
    setShowAddForm(false)
    toast.success('Calendar added successfully')
  }

  const removeCalendar = (id: string) => {
    setCalendars(calendars.filter(cal => cal.id !== id))
    setEvents(events.filter(event => !event.id.startsWith(id)))
    toast.success('Calendar removed')
  }

  const startEditCalendar = (calendar: CalendarSource) => {
    setEditingCalendar(calendar.id)
    setEditName(calendar.name)
    setEditUrl(calendar.url)
  }

  const saveEditCalendar = () => {
    if (!editName.trim() || !editUrl.trim()) {
      toast.error('Please provide both name and URL')
      return
    }

    const trimmedName = editName.trim()
    const trimmedUrl = editUrl.trim()

    // Check for duplicate names (excluding current calendar)
    if (calendars.some(cal => cal.id !== editingCalendar && cal.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast.error('A calendar with this name already exists')
      return
    }

    // Check for duplicate URLs (excluding current calendar, normalized)
    if (calendars.some(cal => cal.id !== editingCalendar && normalizeUrl(cal.url) === normalizeUrl(trimmedUrl))) {
      toast.error('A calendar with this URL already exists')
      return
    }

    setCalendars(calendars.map(cal =>
      cal.id === editingCalendar
        ? { ...cal, name: trimmedName, url: trimmedUrl }
        : cal
    ))
    setEditingCalendar(null)
    setEditName('')
    setEditUrl('')
    toast.success('Calendar updated successfully')
  }

  const cancelEditCalendar = () => {
    setEditingCalendar(null)
    setEditName('')
    setEditUrl('')
  }

  const resetToDefaults = () => {
    setCalendars(defaultCalendars)
    setEvents([])
    toast.success('Reset to default calendars')
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  useEffect(() => {
    loadAllCalendars()
  }, [selectedRange, calendars, loadAllCalendars])

  // Group events by date
  const groupedEvents = events.reduce((acc, event) => {
    const dateKey = event.start.toDateString()
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(event)
    return acc
  }, {} as { [key: string]: CalendarEvent[] })

  return (
    <ClientToolLayout
      title="Calendar Dashboard"
      icon={Calendar}
      iconColor="bg-red-500"
      description="View and manage your calendar events from multiple sources"
      maxWidth="6xl"
      backgroundColor="bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      {/* Controls and Calendar Sources - Side by Side */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Dashboard Controls - Left */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 lg:w-1/2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard Controls</h2>
            <button
              onClick={loadAllCalendars}
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Time Range Selector */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Range</label>
              <select
                value={selectedRange.label}
                onChange={(e) => {
                  const range = TIME_RANGES.find(r => r.label === e.target.value)
                  if (range) setSelectedRange(range)
                }}
                className="w-full border border-gray-300 dark:border-gray-500 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-500 dark:text-white"
              >
                {TIME_RANGES.map(range => (
                  <option key={range.label} value={range.label}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Actions</label>
              <div className="space-y-2">
                <button
                  onClick={resetToDefaults}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-500 dark:bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset to Defaults</span>
                </button>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="w-full flex items-center justify-center space-x-2 bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Calendar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Add Calendar Form */}
          {showAddForm && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <label className="block text-sm font-medium text-gray-700 mb-3">Add New Calendar</label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Calendar Name</label>
                  <input
                    type="text"
                    placeholder="Enter calendar name"
                    value={newCalendarName}
                    onChange={(e) => setNewCalendarName(e.target.value)}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 bg-white ${
                      isDuplicateName(newCalendarName) 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {isDuplicateName(newCalendarName) && (
                    <p className="text-xs text-red-600 mt-1">⚠️ A calendar with this name already exists</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Calendar URL</label>
                  <input
                    type="url"
                    placeholder="https://... or webcal://..."
                    value={newCalendarUrl}
                    onChange={(e) => setNewCalendarUrl(e.target.value)}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 bg-white ${
                      isDuplicateUrl(newCalendarUrl) 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {isDuplicateUrl(newCalendarUrl) && (
                    <p className="text-xs text-red-600 mt-1">⚠️ A calendar with this URL already exists</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addCalendar}
                  disabled={isDuplicateName(newCalendarName) || isDuplicateUrl(newCalendarUrl)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Add Calendar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Calendar Sources - Right */}
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 lg:w-1/2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Calendar Sources ({calendars.length})</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {calendars.map((calendar) => (
              <div key={calendar.id} className="border border-gray-200 rounded-lg p-4">
                {editingCalendar === calendar.id ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Calendar Name"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                            isDuplicateName(editName, editingCalendar) 
                              ? 'border-red-300 focus:ring-red-500' 
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                        />
                        {isDuplicateName(editName, editingCalendar) && (
                          <p className="text-xs text-red-600 mt-1">⚠️ A calendar with this name already exists</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="url"
                          placeholder="iCalendar URL"
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                            isDuplicateUrl(editUrl, editingCalendar) 
                              ? 'border-red-300 focus:ring-red-500' 
                              : 'border-gray-300 focus:ring-blue-500'
                          }`}
                        />
                        {isDuplicateUrl(editUrl, editingCalendar) && (
                          <p className="text-xs text-red-600 mt-1">⚠️ A calendar with this URL already exists</p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={cancelEditCalendar}
                        className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEditCalendar}
                        disabled={isDuplicateName(editName, editingCalendar) || isDuplicateUrl(editUrl, editingCalendar)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: calendar.color }}
                      />
                      <div className="flex-1 min-w-0 max-w-full">
                        <div className="font-medium text-gray-900 dark:text-white truncate">{calendar.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate" title={calendar.url}>
                          {calendar.url}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0 ml-3">
                      <button
                        onClick={() => startEditCalendar(calendar)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="Edit calendar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeCalendar(calendar.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove calendar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {calendars.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No calendars configured</p>
                <p className="text-sm mt-1">Add a calendar or reset to defaults to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Events Display */}
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Upcoming Events ({events.length})
          </h2>
          {loading && (
            <div className="flex items-center space-x-2 text-blue-500 dark:text-blue-400">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading events...</span>
            </div>
          )}
        </div>

        {events.length === 0 && !loading ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No events found for the selected time range</p>
            <p className="text-gray-400 dark:text-gray-400 text-sm mt-2">Try selecting a longer time range or check your calendar sources</p>
          </div>
        ) : (
          <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
            {Object.entries(groupedEvents).map(([dateString, dayEvents]) => (
              <div key={dateString} className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {formatDate(new Date(dateString))}
                </h3>
                <div className="space-y-3">
                  {dayEvents.map((event) => (
                    <div key={event.id} className="bg-gray-50 dark:bg-gray-500 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-400 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: event.calendarColor }}
                            />
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{event.title}</h4>
                            <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-white rounded-full">
                              {event.calendarName}
                            </span>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-200">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                {formatDateTime(event.start)} - {formatDateTime(event.end)}
                              </span>
                            </div>
                            {event.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>

                          {event.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-200 mt-2 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ClientToolLayout>
  )
}

export default function CalendarDashboardPage() {
  return (
    <ProtectedTool toolId="calendar-dashboard">
      <CalendarDashboard />
    </ProtectedTool>
  )
}