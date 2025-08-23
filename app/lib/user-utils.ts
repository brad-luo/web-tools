import { OAuthAccountModel } from './models/user'

export async function getUserAvatar(userId: number): Promise<string | null> {
  try {
    // Get user's OAuth accounts
    const oauthAccounts = await OAuthAccountModel.findByUserId(userId)
    
    if (oauthAccounts.length === 0) {
      return null
    }
    
    // For GitHub, we can construct the avatar URL from the provider_user_id
    const githubAccount = oauthAccounts.find(account => account.provider === 'github')
    if (githubAccount) {
      return `https://avatars.githubusercontent.com/u/${githubAccount.provider_user_id}?v=4`
    }
    
    // For Google, we'll need to get it from the OAuth profile (will implement later)
    // For now, return null for non-GitHub accounts
    return null
    
  } catch (error) {
    console.error('Error getting user avatar:', error)
    return null
  }
}

export function getProviderAvatarUrl(provider: string, providerUserId: string, profileImage?: string): string | null {
  switch (provider) {
    case 'github':
      return `https://avatars.githubusercontent.com/u/${providerUserId}?v=4`
    case 'google':
      // For Google, we should use the profile image if available
      return profileImage || null
    default:
      return null
  }
}