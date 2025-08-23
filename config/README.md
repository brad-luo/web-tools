# Configuration Files

This directory contains JSON configuration files for the Web Tools application.

## Files

- `calendar-dashboard.json` - Configuration for the Calendar Dashboard tool
  - Default calendar sources (Google, Apple, Outlook)
  - Color palette for calendar visualization

- `tools.json` - Configuration for the main tools list
  - Tool definitions with metadata (name, description, icon, href, color, category)
  - Category definitions for grouping tools

## Adding New Configurations

1. Create a new JSON file named `[tool-name].json`
2. Create API route at `/app/api/config/[tool-name]/route.ts` using `getToolConfig()`
3. Use configuration in your tool component via the API endpoint

See `/docs/configuration.md` for detailed instructions.

## Configuration Pattern

All tools use the same generic configuration pattern:

```typescript
// API route example
import { getToolConfig } from '../../../lib/config'

const defaultConfig = { /* your defaults */ }

export async function GET() {
  const config = await getToolConfig('tool-name', defaultConfig)
  return NextResponse.json(config)
}
```

## Guidelines

- Use descriptive property names
- Provide sensible defaults in API route
- Group related settings
- Never store secrets (use environment variables instead)
- Include fallback defaults in case config file is missing