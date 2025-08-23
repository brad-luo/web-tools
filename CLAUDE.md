# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with Next.js configuration

## Architecture Overview

This is a Next.js 14 application using the App Router with TypeScript, providing 6 web development tools behind OAuth authentication.

### Authentication System
- Uses NextAuth.js v4 with GitHub and Google OAuth providers
- JWT-based sessions with 7-day expiry
- **Optional Authentication**: Login is now optional - users can access the app without authentication
- **Per-tool Authentication Control**: Each tool has a `loginRequired` field in configuration
- Middleware only handles login page redirects for authenticated users
- Configuration: `app/auth.ts` and `middleware.ts`
- Required environment variables: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GITHUB_ID`, `GITHUB_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

### Permission System
- **Tool-level permissions**: Tools can be configured to require login via `loginRequired` boolean in `config/tools.json`
- **Login confirmation modal**: When unauthenticated users try to access login-required tools, a modal asks if they want to login
- **User header**: Shows login button for unauthenticated users, user info and logout for authenticated users
- **Protected tool wrapper**: `ProtectedTool` component handles authentication checks and modal display
- **Authentication states**: Components use `useSession` to check authentication status and show appropriate UI

### App Structure
- **App Router**: All pages in `app/` directory
- **Tools**: Each tool is a separate page in `app/tools/[tool-name]/page.tsx`
- **Authentication**: Login page at `app/login/page.tsx` with OAuth buttons
- **Components**: Reusable components in `app/components/`
- **User Session**: `UserHeader.tsx` component shows authenticated user info

### Tools Implementation
Each tool follows the same pattern:
1. Self-contained page component in `app/tools/[tool-name]/page.tsx`
2. Client-side React state management
3. Tailwind CSS styling with consistent design system
4. No external APIs - all processing done client-side

Available tools:
- URL Encoder/Decoder (`url-encoder`)
- Base64 Converter (`base64-converter`) 
- JSON Formatter (`json-formatter`)
- Text Case Converter (`text-converter`)
- Color Picker & Converter (`color-picker`)
- Markdown Editor (`markdown-editor`) - with syntax highlighting and live preview

### Key Dependencies
- NextAuth.js for authentication
- Tailwind CSS for styling
- Lucide React for icons
- React Markdown with GitHub Flavored Markdown
- React Syntax Highlighter for code blocks

### Authentication Flow
1. **Optional Authentication**: Most routes accessible without login
2. **Tool-specific Requirements**: Some tools require authentication (configured via `loginRequired` in `config/tools.json`)
3. **Login Modal**: Unauthenticated users accessing login-required tools see confirmation modal
4. **OAuth Login**: Login page offers GitHub/Google OAuth
5. **Session Management**: Sessions persist for 7 days, user can logout from header dropdown
6. **Authenticated User Flow**: Logged-in users redirected from `/login` to homepage

### Configuration System
- **Tool Configuration**: JSON files in `/config/` directory using `[tool-name].json` naming pattern
- **Tools List**: Central configuration in `/config/tools.json` with tool metadata including `loginRequired` field
- **Generic Pattern**: All tools use `getToolConfig('tool-name', defaultConfig)` in API routes
- **Calendar Dashboard**: Configuration in `/config/calendar-dashboard.json`
- **API Access**: Configuration served via `/api/config/[tool]` and `/api/config/tool/[id]` endpoints
- **Permission Control**: Each tool entry includes `loginRequired: boolean` to control authentication requirements
- **Fallback Defaults**: API routes include fallback defaults for missing config files
- **Environment Variables**: Reserved for secrets and deployment-specific settings only

### Environment Setup
Development requires OAuth apps configured for both GitHub and Google with appropriate callback URLs (`http://localhost:3000/api/auth/callback/[provider]` for development).