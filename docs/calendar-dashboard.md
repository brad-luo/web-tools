# Calendar Dashboard Tool Documentation

## Overview

The Calendar Dashboard is a web-based tool that aggregates and displays calendar events from multiple sources in a unified interface. It supports standard iCalendar (ICS) format, making it compatible with popular calendar services like Google Calendar, Apple iCloud Calendar, and Microsoft Outlook.

## Features

### Multi-Source Integration
- **Default Calendars**: Pre-configured with Brad's personal calendars from Google, Apple, and Outlook
- **Custom Sources**: Add any iCalendar-compliant URL (ICS format)
- **Universal Compatibility**: Works with any calendar service that provides iCalendar feeds

### Time Range Filtering
- **Flexible Periods**: Choose from 1 week, 1 month, 3 months, 6 months, or 1 year
- **Dynamic Updates**: Events automatically refresh when time range changes
- **Future Focus**: Shows only upcoming events from the current date forward

### Visual Organization
- **Color Coding**: Each calendar source has a unique color for easy identification
- **Chronological Grouping**: Events are organized by date and sorted by time
- **Detailed Information**: Display event titles, times, locations, and descriptions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Calendar Management
- **Add Calendars**: Simple form to add new iCalendar sources
- **Remove Calendars**: One-click removal of calendar sources
- **Refresh Data**: Manual refresh button to update all calendar events
- **Real-time Status**: Loading indicators and success/error messages

## Technical Implementation

### Architecture
- **Frontend**: React with TypeScript and Tailwind CSS
- **Calendar Parsing**: ical.js library for processing iCalendar data
- **CORS Handling**: Uses allorigins.win proxy service for cross-origin requests
- **State Management**: React hooks for local state management

### Data Flow
1. **Fetch**: HTTP requests to calendar URLs via CORS proxy
2. **Parse**: ical.js converts ICS format to JavaScript objects
3. **Filter**: Events filtered by selected time range
4. **Sort**: Events sorted chronologically within each day
5. **Display**: Rendered with color coding and detailed information

### Calendar URL Formats
- **Google Calendar**: `https://calendar.google.com/calendar/ical/[email]/public/basic.ics`
- **Apple iCloud**: `webcal://[server]/published/[path]/calendar.ics`
- **Outlook**: `https://outlook.live.com/owa/calendar/[path]/calendar.ics`
- **Generic ICS**: Any URL serving standard iCalendar format

## Usage Guide

### Getting Started
1. Navigate to the Calendar Dashboard from the main tools page
2. The tool loads with three default calendar sources
3. Events for the next month are displayed by default

### Adding Custom Calendars
1. Click the "Add Calendar" button
2. Enter a descriptive name for the calendar
3. Paste the iCalendar URL (must start with `https://` or `webcal://`)
4. Click "Add Calendar" to save and load events

### Changing Time Range
1. Use the "Time Range" dropdown in the header
2. Select from: 1 Week, 1 Month, 3 Months, 6 Months, or 1 Year
3. Events automatically refresh for the new time period

### Managing Calendar Sources
- **View Sources**: All active calendars are shown in the "Calendar Sources" section
- **Remove Sources**: Click the trash icon next to any calendar to remove it
- **Color Identification**: Each calendar has a unique color dot for easy recognition

### Refreshing Data
- Click the "Refresh" button in the header to reload all calendar data
- Loading spinner indicates when data is being fetched
- Success/error toasts provide feedback on the operation

## Troubleshooting

### Common Issues

**Calendar Not Loading**
- Verify the calendar URL is publicly accessible
- Ensure the URL serves iCalendar format (`.ics`)
- Check that the calendar owner has enabled public sharing

**CORS Errors**
- The tool uses a CORS proxy service (allorigins.win)
- If proxy fails, try refreshing or using a different calendar URL format

**No Events Showing**
- Verify the selected time range includes future events
- Check that the calendar contains events in the specified period
- Try refreshing the calendar data

**WebCal URLs**
- `webcal://` URLs are automatically converted to `https://`
- Some calendar services use webcal protocol for subscription

### Calendar URL Examples

**Google Calendar Public Link:**
```
https://calendar.google.com/calendar/ical/your-email%40gmail.com/public/basic.ics
```

**Apple iCloud Shared Calendar:**
```
webcal://p134-caldav.icloud.com/published/2/[long-identifier]/calendar.ics
```

**Outlook Shared Calendar:**
```
https://outlook.live.com/owa/calendar/[uuid]/[identifier]/cid-[id]/calendar.ics
```

## Privacy and Security

- **Client-Side Processing**: All calendar parsing happens in your browser
- **No Data Storage**: Calendar data is not stored on servers
- **CORS Proxy**: Uses third-party service for fetching calendar data
- **Public Calendars Only**: Works only with publicly accessible calendar URLs

## Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **JavaScript Required**: Client-side processing requires JavaScript
- **CORS Support**: Modern browsers with CORS support

## Future Enhancements

- **Calendar Export**: Export aggregated events to ICS format
- **Event Filtering**: Filter events by title, location, or calendar source
- **Notification Reminders**: Browser notifications for upcoming events
- **Timezone Support**: Display events in different timezones
- **Recurring Events**: Better handling of recurring event patterns

## Technical Notes

### Dependencies
- `ical.js`: iCalendar parsing library
- `lucide-react`: Icons for the interface
- `react-hot-toast`: Toast notifications

### API Limitations
- Relies on CORS proxy service availability
- Limited to publicly accessible calendar URLs
- No support for authenticated calendar access

### Performance
- Events are fetched on-demand
- Parsing happens client-side for privacy
- Responsive design optimized for various screen sizes