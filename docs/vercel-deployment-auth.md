# Deploying Authentication to Vercel

This guide covers deploying your Web Tools application with authentication to Vercel.

## 🚀 Quick Deployment Steps

### Step 1: Configure OAuth Applications

Before deploying, make sure you have:

1. **GitHub OAuth App** configured with:
   - Homepage URL: `https://your-domain.vercel.app`
   - Authorization callback URL: `https://your-domain.vercel.app/api/auth/callback/github`

2. **Google OAuth App** configured with:
   - Authorized JavaScript origins: `https://your-domain.vercel.app`
   - Authorized redirect URIs: `https://your-domain.vercel.app/api/auth/callback/google`

### Step 2: Set Environment Variables in Vercel

#### Method A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and open your project
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:

```
NEXTAUTH_URL = https://your-actual-domain.vercel.app
NEXTAUTH_SECRET = your-super-secret-key-at-least-32-characters-long
GITHUB_ID = your-github-client-id
GITHUB_SECRET = your-github-client-secret
GOOGLE_CLIENT_ID = your-google-client-id
GOOGLE_CLIENT_SECRET = your-google-client-secret
```

4. Set each variable for **Production** environment
5. Optionally set for **Preview** and **Development** environments

#### Method B: Via Vercel CLI

1. **Link your project** (if not already done):
   ```bash
   vercel link
   ```

2. **Add environment variables**:
   ```bash
   vercel env add NEXTAUTH_URL production
   # Enter: https://your-domain.vercel.app
   
   vercel env add NEXTAUTH_SECRET production
   # Enter: your-super-secret-key-at-least-32-characters-long
   
   vercel env add GITHUB_ID production
   # Enter: your-github-client-id
   
   vercel env add GITHUB_SECRET production
   # Enter: your-github-client-secret
   
   vercel env add GOOGLE_CLIENT_ID production
   # Enter: your-google-client-id
   
   vercel env add GOOGLE_CLIENT_SECRET production
   # Enter: your-google-client-secret
   ```

### Step 3: Deploy

#### Automatic Deployment (Recommended)
- Push to your main branch on GitHub
- Vercel will automatically deploy with the new environment variables

#### Manual Deployment
```bash
vercel --prod
```

## 🔐 Generating NEXTAUTH_SECRET

The `NEXTAUTH_SECRET` should be a random string at least 32 characters long:

```bash
# Generate a secure random secret
openssl rand -base64 32
```

Copy the output and use it as your `NEXTAUTH_SECRET`.

## 🌍 Domain Configuration

### Custom Domain Setup

1. **Add Custom Domain** in Vercel:
   - Go to your project settings
   - Navigate to **Domains**
   - Add your custom domain

2. **Update OAuth Applications**:
   - Update GitHub OAuth app URLs to use your custom domain
   - Update Google OAuth app URLs to use your custom domain

3. **Update Environment Variables**:
   - Change `NEXTAUTH_URL` to your custom domain
   - Redeploy the application

### Preview Deployments

For preview deployments (pull requests), you may want to:

1. **Add Preview Environment Variables**:
   - Set the same variables for **Preview** environment
   - Use the preview URL format: `https://your-app-git-branch-username.vercel.app`

2. **Configure OAuth for Preview**:
   - Add preview URLs to your OAuth application settings
   - Or use separate OAuth apps for preview environments

## 🔧 Troubleshooting

### Common Issues

1. **"Configuration Error"**
   - Check that all environment variables are set
   - Verify `NEXTAUTH_URL` matches your actual domain
   - Ensure `NEXTAUTH_SECRET` is at least 32 characters

2. **OAuth Redirect Mismatch**
   - Verify callback URLs in GitHub/Google match exactly
   - Check for trailing slashes or protocol mismatches

3. **Environment Variables Not Loading**
   - Redeploy after adding environment variables
   - Check that variables are set for the correct environment (Production/Preview)

### Debug Mode

To enable debug mode in production:

```bash
vercel env add NEXTAUTH_DEBUG production
# Enter: true
```

This will show detailed authentication logs in Vercel function logs.

## 📊 Monitoring

### Check Deployment Status

```bash
vercel ls
vercel inspect your-deployment-url
```

### View Logs

```bash
vercel logs your-deployment-url
```

### Function Logs

Authentication errors will appear in Vercel function logs:
- Go to your project dashboard
- Click on **Functions** tab
- Check logs for `/api/auth/[...nextauth]`

## 🔄 Updating After Deployment

### Adding New OAuth Providers

1. Update `app/auth.ts` with new provider
2. Add new environment variables to Vercel
3. Push changes to trigger deployment
4. Configure new OAuth application

### Changing Domains

1. Update `NEXTAUTH_URL` environment variable
2. Update OAuth application callback URLs
3. Redeploy the application

## ✅ Verification Checklist

After deployment, verify:

- [ ] Application loads at your domain
- [ ] Redirects to login page when not authenticated
- [ ] GitHub login works correctly
- [ ] Google login works correctly
- [ ] User avatar displays properly
- [ ] Session persists after page refresh
- [ ] Logout works correctly
- [ ] All tools are accessible after login

## 🚀 Production Best Practices

1. **Security**:
   - Use strong, unique `NEXTAUTH_SECRET`
   - Enable HTTPS only in production
   - Regularly rotate OAuth secrets

2. **Performance**:
   - Monitor authentication response times
   - Check Vercel function execution times
   - Optimize session storage if needed

3. **Monitoring**:
   - Set up error tracking (Sentry, etc.)
   - Monitor authentication success rates
   - Track user login patterns

## 📚 Additional Resources

- [NextAuth.js Deployment Guide](https://next-auth.js.org/deployment)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
