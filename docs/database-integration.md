# Database Integration with Neon PostgreSQL

This document describes the database integration implemented to store user information and OAuth accounts in a Neon PostgreSQL database.

## Overview

The application now uses Neon PostgreSQL to persist user data instead of only storing it in JWT tokens. This provides better data consistency and enables more advanced user management features.

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### OAuth Accounts Table
```sql
CREATE TABLE oauth_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (provider, provider_user_id)
);

CREATE INDEX idx_oauth_accounts_user_id ON oauth_accounts(user_id);
```

## Architecture

### Database Connection (`app/lib/db.ts`)
- Uses `@neondatabase/serverless` for Neon database connectivity
- Provides lazy initialization to handle build-time scenarios
- Exports `getDatabase()` helper function for safe connection access

### Data Models (`app/lib/models/user.ts`)
- **UserModel**: CRUD operations for users table
- **OAuthAccountModel**: CRUD operations for oauth_accounts table
- Both models include proper error handling and TypeScript interfaces

### NextAuth.js Integration (`app/lib/auth-adapter.ts`)
- Custom adapter implementing NextAuth.js adapter interface
- Handles user creation, account linking, and user retrieval
- Maintains compatibility with JWT-based session strategy

## Configuration

### Environment Variables
The following environment variable is required:
- `DATABASE_URL`: PostgreSQL connection string for Neon database

Example:
```
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

### NextAuth.js Configuration (`app/auth.ts`)
- Configured to use the custom Neon database adapter
- Maintains JWT session strategy for optimal performance
- Includes proper TypeScript types for user sessions

## Authentication Flow

1. **User Login**: OAuth provider (GitHub/Google) authenticates user
2. **Email-based Account Linking**: System automatically links accounts with same email address
3. **Account Lookup**: System checks if OAuth account exists in database
4. **User Creation**: If new user, creates record in `users` table
5. **Account Linking**: Links OAuth account to user in `oauth_accounts` table
6. **JWT Token**: Creates JWT with user ID for session management
7. **Session Management**: User information available through NextAuth.js hooks

### Automatic Account Linking

The system implements automatic account linking for trusted OAuth providers (GitHub and Google) when users have the same verified email address. This prevents the `OAuthAccountNotLinked` error and allows users to sign in with either provider seamlessly.

**How it works:**
1. User attempts to sign in with a different OAuth provider (e.g., Google after previously using GitHub)
2. System checks if a user with the same email already exists
3. If found, the new OAuth account is automatically linked to the existing user
4. User can now use either OAuth provider to access their account
5. All OAuth accounts remain linked to the same user profile

This approach is safe because:
- Both GitHub and Google verify email addresses
- We only link accounts from trusted OAuth providers
- Email addresses are used as the primary identifier
- No manual user intervention is required

## Key Features

- **Persistent User Storage**: User data persists across sessions
- **OAuth Account Management**: Supports multiple OAuth providers per user
- **Type Safety**: Full TypeScript support with proper interfaces
- **Error Handling**: Comprehensive error handling in all database operations
- **Build Compatibility**: Graceful handling of missing DATABASE_URL during build

## File Structure

```
app/lib/
├── db.ts                 # Database connection configuration
├── auth-adapter.ts       # NextAuth.js database adapter
└── models/
    └── user.ts          # User and OAuth account data models

types/
└── next-auth.d.ts       # NextAuth.js TypeScript declarations
```

## Usage Examples

### Accessing User Data in Components
```tsx
import { useSession } from 'next-auth/react';

function UserProfile() {
  const { data: session } = useSession();
  
  if (session?.user) {
    // User ID is now available from database
    console.log('User ID:', session.user.id);
    console.log('Email:', session.user.email);
  }
}
```

### Direct Database Access
```tsx
import { UserModel } from '@/app/lib/models/user';

// Find user by email
const user = await UserModel.findByEmail('user@example.com');

// Create new user
const newUser = await UserModel.create({
  email: 'user@example.com',
  username: 'johndoe'
});
```

## Migration Notes

- Existing JWT sessions remain compatible
- No breaking changes to existing authentication flow
- User data is now persisted and can be queried directly
- OAuth tokens are stored for potential future API integrations

## Security Considerations

- All database credentials are stored securely in environment variables
- OAuth tokens are encrypted at rest in the database
- User passwords (if implemented) use secure hashing
- Proper indexes ensure efficient queries
- Foreign key constraints maintain data integrity