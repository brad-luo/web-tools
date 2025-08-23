# Permission System Documentation

This document describes the updated permission system that allows for optional authentication and per-tool access control.

## Overview

The application now supports optional authentication where users can access the app without logging in, but certain tools can be configured to require authentication.

## Key Components

### 1. Tool Configuration (`config/tools.json`)

Each tool in the configuration now includes a `loginRequired` boolean field:

```json
{
  "id": "calendar-dashboard",
  "name": "Calendar Dashboard",
  "description": "View and manage events from multiple calendar sources",
  "loginRequired": true
}
```

### 2. Authentication Middleware (`middleware.ts`)

- **Before**: Protected all routes except `/login` and `/api/auth`
- **After**: Only handles redirect logic for authenticated users accessing the login page
- Allows access to all routes regardless of authentication status

### 3. User Header Component (`app/components/UserHeader.tsx`)

Shows different UI based on authentication status:
- **Authenticated**: User avatar, name, and dropdown menu with logout option
- **Unauthenticated**: Blue "Login" button that redirects to `/login`

### 4. Login Confirmation Modal (`app/components/LoginRequiredModal.tsx`)

Modal component that appears when unauthenticated users try to access login-required tools:
- Displays tool name and asks if user wants to login
- "Yes, Login" button redirects to `/login`
- "Cancel" button closes the modal

### 5. Protected Tool Wrapper (`app/components/ProtectedTool.tsx`)

Client component that:
- Fetches tool configuration via API
- Checks if tool requires login
- Wraps tool content with authentication logic
- Shows loading and error states

### 6. Authentication Wrapper (`app/components/AuthWrapper.tsx`)

Handles the authentication checking logic:
- Uses `useSession` to check authentication status
- Shows loading state while session is being fetched
- For login-required tools without auth: shows modal and placeholder content
- For accessible tools or authenticated users: renders children normally

### 7. Tools Grid (`app/components/ToolsGrid.tsx`)

Enhanced tool grid on homepage:
- Prevents navigation to login-required tools for unauthenticated users
- Shows login confirmation modal instead
- Displays "Login Required" badge on applicable tools

## API Endpoints

### `/api/config/tool/[id]`

Returns configuration for a specific tool by ID, including the `loginRequired` field.

**Response:**
```json
{
  "id": "calendar-dashboard",
  "name": "Calendar Dashboard",
  "description": "View and manage events from multiple calendar sources",
  "icon": "Calendar",
  "href": "/tools/calendar-dashboard",
  "color": "bg-red-500",
  "category": "productivity",
  "loginRequired": true
}
```

## Usage Patterns

### For Tool Pages

Wrap your tool component with `ProtectedTool`:

```tsx
import { ProtectedTool } from '../../components/ProtectedTool'

function MyTool() {
  // Tool implementation
}

export default function MyToolPage() {
  return (
    <ProtectedTool toolId="my-tool">
      <MyTool />
    </ProtectedTool>
  )
}
```

### For Server Components with Authentication

Use `ToolLayout` which now includes `UserHeader`:

```tsx
import ToolLayout from '../../components/ToolLayout'

export default async function MyTool() {
  return (
    <ToolLayout
      title="My Tool"
      icon={MyIcon}
      iconColor="bg-blue-500"
    >
      {/* Tool content */}
    </ToolLayout>
  )
}
```

## Configuration Examples

### Public Tool (No Login Required)
```json
{
  "id": "json-formatter",
  "name": "JSON Formatter",
  "loginRequired": false
}
```

### Protected Tool (Login Required)
```json
{
  "id": "calendar-dashboard",
  "name": "Calendar Dashboard", 
  "loginRequired": true
}
```

## User Experience Flow

1. **Unauthenticated User Accessing Public Tool**:
   - Direct access to tool
   - No authentication prompts

2. **Unauthenticated User Accessing Protected Tool**:
   - Click on tool shows confirmation modal
   - Can choose to login or cancel
   - Direct URL access shows placeholder with modal

3. **Authenticated User**:
   - Access to all tools regardless of `loginRequired` setting
   - User dropdown in header shows logout option

## Implementation Notes

- All components use `useSession` from NextAuth.js for client-side auth checking
- Server components use `getSession()` for server-side auth checking  
- The system is backward compatible - existing tools work without modification
- Login state is managed globally via NextAuth.js session provider