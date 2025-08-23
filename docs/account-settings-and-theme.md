# Account Settings and Theme System

This document describes the Account Settings page and dark mode theme system implementation.

## Overview

The application now features a comprehensive account settings page and theme system that follows industry standards for user experience and accessibility.

## Theme System

### Theme Provider (`app/lib/theme-context.tsx`)
- **Theme Options**: Light, Dark, and System
- **System Theme**: Automatically follows OS preference
- **Persistence**: Theme preference saved to localStorage
- **Dynamic Updates**: Real-time theme switching without page refresh
- **CSS Classes**: Uses Tailwind's `dark:` modifier with class-based dark mode

### Theme Selector Component (`app/components/ThemeSelector.tsx`)
- **Dropdown Interface**: Clean dropdown with icons for each theme option
- **Visual Feedback**: Shows current theme with appropriate icon
- **Accessibility**: Keyboard navigation and focus management
- **Responsive**: Adapts to different screen sizes

### Implementation Details
- **Context API**: React Context for state management
- **localStorage**: Persistent theme preferences
- **Media Query**: Listens to system theme changes
- **Tailwind Integration**: Configured with `darkMode: 'class'`

## Account Settings Page

### Page Structure (`app/account/page.tsx`)
- **Authentication Required**: Redirects unauthenticated users to login
- **Left Sidebar**: Navigation with expandable tabs
- **Main Content**: Context-sensitive content area
- **Responsive Design**: Mobile-first approach with sidebar stacking

### Features

#### General Tab
- **User Profile**: Displays user avatar, name, and email
- **Connected Accounts**: Shows linked OAuth providers (GitHub, Google)
- **Account Information**: Read-only display of user data
- **Provider Icons**: Visual indicators for each OAuth provider

#### Navigation Structure
- **General** (Active): User profile and connected accounts
- **Security** (Coming Soon): Password and security settings
- **Preferences** (Coming Soon): Application preferences

### API Integration

#### OAuth Accounts Endpoint (`app/api/user/oauth-accounts/route.ts`)
- **Authentication**: Requires valid session
- **Data Sanitization**: Returns only safe, non-sensitive account data
- **Error Handling**: Comprehensive error responses
- **Security**: No access tokens or sensitive data exposed

## User Interface Updates

### Header Navigation (`app/components/UserHeader.tsx`)
- **Theme Selector**: Always visible theme dropdown
- **Account Dropdown**: Enhanced with Account Settings link
- **Visual Consistency**: Dark mode support throughout
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Dark Mode Support
- **Global Styles**: Updated layout with dark mode classes
- **Component Updates**: All components support light/dark themes
- **Smooth Transitions**: CSS transitions for theme switching
- **Color Consistency**: Proper contrast ratios in both themes

## Technical Implementation

### Theme Context Structure
```tsx
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}
```

### Local Storage Schema
```typescript
// Theme preference
localStorage.getItem('theme') // 'light' | 'dark' | 'system'
```

### Database Integration
- Uses existing user authentication system
- Fetches OAuth accounts from database
- No additional database schema changes required

## Styling Standards

### Dark Mode Classes
- **Background**: `bg-white dark:bg-gray-800`
- **Text**: `text-gray-900 dark:text-white`
- **Borders**: `border-gray-200 dark:border-gray-700`
- **Hover States**: `hover:bg-gray-100 dark:hover:bg-gray-700`

### Component Design Patterns
- **Cards**: Consistent shadow and border styling
- **Buttons**: Proper focus states and transitions
- **Forms**: Read-only displays with consistent spacing
- **Navigation**: Active states and hover effects

## Security Considerations

### Data Exposure
- **OAuth Tokens**: Never exposed to client-side
- **User Data**: Only displays non-sensitive information
- **API Protection**: All endpoints require authentication
- **Session Validation**: Server-side session verification

### Privacy
- **Theme Preference**: Stored locally, not tracked server-side
- **Account Data**: Minimal data exposure principle
- **User Control**: Full control over account visibility

## Usage Examples

### Using Theme Context
```tsx
import { useTheme } from '@/app/lib/theme-context'

function MyComponent() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  
  return (
    <div className={`${resolvedTheme === 'dark' ? 'dark-specific-class' : ''}`}>
      <button onClick={() => setTheme('dark')}>
        Switch to Dark Theme
      </button>
    </div>
  )
}
```

### Accessing Account Settings
- Click user avatar in top-right header
- Select "Account Settings" from dropdown
- Navigate between tabs in left sidebar
- View connected OAuth providers and user info

## Browser Support

### Theme System
- **Modern Browsers**: Full support with prefers-color-scheme
- **Safari**: Full support including system theme detection
- **Chrome/Firefox**: Complete functionality
- **Mobile Browsers**: Responsive design with touch-friendly controls

### Local Storage
- **Persistence**: Works across all modern browsers
- **Fallback**: Graceful degradation to system theme if storage fails
- **Privacy Mode**: Respects browser privacy settings

## Future Enhancements

### Planned Features
- **Security Tab**: Two-factor authentication, password management
- **Preferences Tab**: Notification settings, language preferences
- **Account Management**: Username changes, account deletion
- **Theme Customization**: Custom color schemes, accent colors

### API Extensions
- User profile updates endpoint
- Account management operations
- Security settings management
- Notification preferences

This implementation follows modern web application patterns and provides a solid foundation for future user management features.