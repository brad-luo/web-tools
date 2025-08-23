'use client'

import { useState, useEffect, useCallback } from 'react'
import { Calendar, Plus, Clock, MapPin, Trash2, RefreshCw } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ClientToolLayout from '../../components/ClientToolLayout'
import { ProtectedTool } from '../../components/ProtectedTool'

// @ts-ignore - ical.js doesn't have TypeScript definitions
import ICAL from 'ical.js'

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  description?: string
  location?: string
  calendarName: string
  calendarColor: string
}

interface CalendarSource {
  id: string
  name: string
  url: string
  color: string
}

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

  // Load configuration on component mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config/calendars')
        if (response.ok) {
          const config = await response.json()
          setCalendars(config.defaultCalendars)
          setColorPalette(config.colorPalette)
        } else {
          console.warn('Failed to load calendar configuration, using defaults')
        }
      } catch (error) {
        console.error('Error loading calendar configuration:', error)
      }
    }
    loadConfig()
  }, [])

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
    
    const newCalendar: CalendarSource = {
      id: Date.now().toString(),
      name: newCalendarName.trim(),
      url: newCalendarUrl.trim(),
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
      {/* Controls */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Dashboard Controls</h2>
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
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Time Range:</label>
            <select
              value={selectedRange.label}
              onChange={(e) => {
                const range = TIME_RANGES.find(r => r.label === e.target.value)
                if (range) setSelectedRange(range)
              }}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {TIME_RANGES.map(range => (
                <option key={range.label} value={range.label}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Add Calendar Button */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Calendar</span>
          </button>
        </div>

        {/* Add Calendar Form */}
        {showAddForm && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Calendar Name"
                  value={newCalendarName}
                  onChange={(e) => setNewCalendarName(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="url"
                  placeholder="iCalendar URL (https://... or webcal://...)"
                  value={newCalendarUrl}
                  onChange={(e) => setNewCalendarUrl(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addCalendar}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Add Calendar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Calendar Sources */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Calendar Sources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {calendars.map((calendar) => (
              <div key={calendar.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: calendar.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">{calendar.name}</span>
                </div>
                <button
                  onClick={() => removeCalendar(calendar.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Events Display */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Upcoming Events ({events.length})
            </h2>
            {loading && (
              <div className="flex items-center space-x-2 text-blue-500">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading events...</span>
              </div>
            )}
          </div>

          {events.length === 0 && !loading ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No events found for the selected time range</p>
              <p className="text-gray-400 text-sm mt-2">Try selecting a longer time range or check your calendar sources</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedEvents).map(([dateString, dayEvents]) => (
                <div key={dateString} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {formatDate(new Date(dateString))}
                  </h3>
                  <div className="space-y-3">
                    {dayEvents.map((event) => (
                      <div key={event.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: event.calendarColor }}
                              />
                              <h4 className="font-semibold text-gray-900">{event.title}</h4>
                              <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
                                {event.calendarName}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
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
                              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
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