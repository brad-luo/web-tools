# Configuration Management

This document describes the configuration system for the Web Tools application, providing a standardized approach for managing tool settings and defaults.

## Overview

The configuration system uses JSON files stored in the `/config` directory to manage tool-specific settings. This approach follows industry standards and provides several benefits:

- **Version Control**: Configuration files are tracked in git
- **Environment Agnostic**: Same configuration works across development and production
- **Type Safety**: JSON schema validation and TypeScript interfaces
- **Flexibility**: Easy to modify without code changes
- **Maintainability**: Centralized configuration management

## Directory Structure

```
config/
├── calendars.json       # Calendar Dashboard configuration
├── [tool-name].json     # Future tool configurations
└── README.md           # Configuration documentation
```

## Configuration Loading

### Server-Side Loading

Configuration is loaded server-side using the utility functions in `/app/lib/config.ts`:

```typescript
import { getCalendarsConfig, getToolConfig } from '../lib/config'

// Load specific tool configuration
const calendarsConfig = await getCalendarsConfig()

// Load generic tool configuration
const toolConfig = await getToolConfig('tool-name', defaultConfig)
```

### Client-Side Access

Client components access configuration through API routes:

```typescript
// Fetch configuration from API endpoint
const response = await fetch('/api/config/tool/calendar-dashboard')
const config = await response.json()
```

## Calendar Dashboard Configuration

### File: `/config/calendar-dashboard.json`

```json
{
  "defaultCalendars": [
    {
      "id": "google",
      "name": "Brad's Google Calendar",
      "url": "https://calendar.google.com/calendar/ical/...",
      "color": "#3B82F6"
    }
  ],
  "colorPalette": [
    "#3B82F6",
    "#10B981",
    "#F59E0B"
  ]
}
```

### Configuration Properties

- **defaultCalendars**: Array of pre-configured calendar sources
  - `id`: Unique identifier for the calendar
  - `name`: Display name for the calendar
  - `url`: iCalendar URL (ICS format)
  - `color`: Hex color code for visual identification

- **colorPalette**: Array of hex colors for new calendar assignments

### API Endpoint

- **GET** `/api/config/tool/calendar-dashboard` - Returns calendar tool configuration with both tool metadata and calendar-specific config

## Adding New Tool Configurations

### 1. Create Configuration File

Create a new JSON file in `/config/[tool-name].json`:

```json
{
  "defaultSettings": {
    "theme": "light",
    "autoSave": true
  },
  "options": [
    "option1",
    "option2"
  ]
}
```

### 2. Create API Route

Create `/app/api/config/[tool-name]/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { getToolConfig } from '../../../lib/config'

const defaultToolConfig = {
  defaultSettings: {
    theme: 'light',
    autoSave: true
  },
  options: ['option1', 'option2']
}

export async function GET() {
  try {
    const config = await getToolConfig('tool-name', defaultToolConfig)
    return NextResponse.json(config)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load configuration' },
      { status: 500 }
    )
  }
}
```

### 3. Define TypeScript Interface (Optional)

You can define types for better type safety, but it's not required since `getToolConfig<T>()` is generic:

```typescript
interface ToolConfig {
  defaultSettings: {
    theme: string
    autoSave: boolean
  }
  options: string[]
}

// Usage in API route:
const config = await getToolConfig<ToolConfig>('tool-name', defaultToolConfig)
```

### 3. Use in Component

Load configuration in your React component:

```typescript
const [config, setConfig] = useState(null)

useEffect(() => {
  const loadConfig = async () => {
    try {
      const response = await fetch('/api/config/tool-name')
      if (response.ok) {
        const config = await response.json()
        setConfig(config)
      }
    } catch (error) {
      console.error('Error loading configuration:', error)
    }
  }
  loadConfig()
}, [])
```

## Best Practices

### Configuration File Structure

1. **Use descriptive property names** that clearly indicate their purpose
2. **Group related settings** under object properties
3. **Provide sensible defaults** for all optional settings
4. **Include comments** in JSON files where helpful (use `//` or `/* */`)

### Error Handling

1. **Always provide fallback defaults** in case configuration loading fails
2. **Log warnings** when configuration files are missing or invalid
3. **Gracefully degrade** functionality when optional configuration is unavailable

### Version Control

1. **Commit configuration files** to version control
2. **Use environment-specific files** sparingly (only for deployment differences)
3. **Document configuration changes** in commit messages

### Security Considerations

1. **Never store secrets** in configuration files
2. **Use environment variables** for sensitive data (API keys, tokens)
3. **Validate configuration data** before using in application

## Environment Variables vs Configuration Files

### Use Environment Variables For:
- API keys and secrets
- Database connection strings
- Authentication tokens
- Deployment-specific settings (URLs, ports)

### Use Configuration Files For:
- Application defaults and settings
- UI configuration and themes
- Tool-specific options
- Data that needs structure (arrays, objects)

## Examples

### Simple Tool Configuration

```json
{
  "name": "Text Converter",
  "defaultCase": "lowercase",
  "availableCases": [
    "uppercase",
    "lowercase", 
    "titlecase",
    "camelcase"
  ]
}
```

### Complex Tool Configuration

```json
{
  "editor": {
    "theme": "dark",
    "fontSize": 14,
    "tabSize": 2,
    "wordWrap": true
  },
  "export": {
    "defaultFormat": "html",
    "includeStyles": true,
    "formats": [
      {
        "name": "HTML",
        "extension": "html",
        "mimeType": "text/html"
      }
    ]
  }
}
```

## Migration Guide

### From Environment Variables

1. Create configuration JSON file
2. Move structured data from environment variables
3. Update code to use configuration API
4. Keep secrets in environment variables

### From Hardcoded Values

1. Identify configurable values in code
2. Create configuration structure
3. Move values to JSON file
4. Update code to load from configuration

This configuration system provides a scalable foundation for managing tool settings while maintaining security and flexibility.