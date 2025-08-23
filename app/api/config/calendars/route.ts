import { NextResponse } from 'next/server'
import { getToolConfig } from '../../../lib/config'

const defaultCalendarConfig = {
  defaultCalendars: [
    {
      id: 'google',
      name: "Brad's Google Calendar",
      url: 'https://calendar.google.com/calendar/ical/xiaoleluo2%40gmail.com/public/basic.ics',
      color: '#3B82F6'
    },
    {
      id: 'apple', 
      name: "Brad's Apple Calendar",
      url: 'webcal://p134-caldav.icloud.com/published/2/MTY1MTcyMDk0ODMxNjUxNzuA8us9ZEuRcEgiE2yDNDUAEJ8O0Sl5dVX2tefeGoyk7P90FGfblVjWr8_TAPMCFmNFv9xBEbKUNsrMjEPQ42g',
      color: '#10B981'
    },
    {
      id: 'outlook',
      name: "Brad's Outlook Calendar", 
      url: 'https://outlook.live.com/owa/calendar/00000000-0000-0000-0000-000000000000/dce73de4-d822-43fd-bcee-d00753d1eb5a/cid-D2BC0415639C05AA/calendar.ics',
      color: '#F59E0B'
    }
  ],
  colorPalette: [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'
  ]
}

export async function GET() {
  try {
    const config = await getToolConfig('calendar-dashboard', defaultCalendarConfig)
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error loading calendar configuration:', error)
    return NextResponse.json(
      { error: 'Failed to load calendar configuration' },
      { status: 500 }
    )
  }
}