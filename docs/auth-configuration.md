# Authentication Configuration Guide

This guide explains how to set up Google and GitHub authentication for the Web Tools application.

## Prerequisites

Before you begin, you'll need:
- A GitHub account
- A Google account with access to Google Cloud Console
- Your application deployed or running locally

## Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-at-least-32-characters

# GitHub OAuth
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

For production, set `NEXTAUTH_URL` to your actual domain.

## Setting Up GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on "New OAuth App"
3. Fill in the application details:
   - **Application name**: Web Tools (or your preferred name)
   - **Homepage URL**: Your website URL or `http://localhost:3000` for local development
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github` for local development or `https://your-domain.com/api/auth/callback/github` for production
4. Click "Register application"
5. You'll receive a Client ID immediately
6. Generate a new client secret
7. Copy the Client ID and Client Secret to your `.env.local` file

## Setting Up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Configure the OAuth consent screen:
   - User Type: External
   - App name: Web Tools (or your preferred name)
   - User support email: Your email
   - Developer contact information: Your email
   - Authorized domains: Your domain (if applicable)
6. Save and continue
7. For the OAuth client ID:
   - Application type: Web application
   - Name: Web Tools (or your preferred name)
   - Authorized JavaScript origins: `http://localhost:3000` for local development and your production URL
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` for local development and `https://your-domain.com/api/auth/callback/google` for production
8. Click "Create"
9. Copy the Client ID and Client Secret to your `.env.local` file

## Generating a NEXTAUTH_SECRET

The `NEXTAUTH_SECRET` is used to encrypt cookies and tokens. It should be a random string at least 32 characters long.

You can generate one with this command:

```bash
openssl rand -base64 32
```

Copy the output to your `.env.local` file as the `NEXTAUTH_SECRET` value.

## Testing Authentication

1. Start your application locally:
   ```bash
   npm run dev
   ```
2. Visit `http://localhost:3000`
3. You should be redirected to the login page
4. Try signing in with both GitHub and Google to ensure both providers are working correctly

## Adding More Providers

The authentication system is designed to be extensible. To add more providers:

1. Install the provider package if needed
2. Add the provider configuration in `app/auth.ts`
3. Add the necessary environment variables
4. Update the login page UI to include the new provider

## Troubleshooting

### Common Issues

1. **Redirect URI Mismatch**: Ensure the callback URLs in your provider settings exactly match what's expected by NextAuth.js.
2. **Invalid Client ID/Secret**: Double-check your environment variables against the values in your provider dashboards.
3. **CORS Issues**: Make sure your `NEXTAUTH_URL` is correctly set and matches your actual URL.
4. **Cookie Issues**: If sessions aren't persisting, check that your `NEXTAUTH_SECRET` is set correctly.

### Provider-Specific Issues

#### GitHub

- If you see a "The redirect_uri in the request did not match a registered redirect_uri" error, check your GitHub OAuth app settings.
- For organization-owned apps, ensure the app has been approved for use in your organization.

#### Google

- Make sure your Google Cloud project has the "OAuth consent screen" properly configured.
- If you're getting "invalid_client" errors, verify your client ID and secret.
- Check that the Google OAuth API is enabled in your Google Cloud project.

## Security Considerations

- Never commit your `.env.local` file to version control
- Rotate your client secrets periodically
- Use HTTPS in production
- Consider implementing additional security measures like rate limiting for login attempts
