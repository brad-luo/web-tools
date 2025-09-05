import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { NeonDatabaseAdapter } from "./auth-adapter";
import { UserModel, OAuthAccountModel } from "./models/user";

export const authOptions: NextAuthOptions = {
  adapter: NeonDatabaseAdapter(),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile, email }) {
      // Handle account linking for trusted OAuth providers
      if (account?.provider === "github" || account?.provider === "google") {
        try {
          // Get profile image URL from the OAuth provider
          let profileImageUrl = user.image;
          if (account.provider === 'github' && profile) {
            profileImageUrl = (profile as any).avatar_url || user.image;
          } else if (account.provider === 'google' && profile) {
            profileImageUrl = (profile as any).picture || user.image;
          }

          // Check if user with this email already exists
          const existingUser = await UserModel.findByEmail(user.email!);

          if (existingUser) {
            // Update user's image if not set
            if (profileImageUrl && !existingUser.image) {
              await UserModel.update(existingUser.id, {
                image: profileImageUrl
              });
            }

            // Check if this OAuth account is already linked
            const existingOAuth = await OAuthAccountModel.findByProviderAndUserId(
              account.provider,
              account.providerAccountId
            );

            if (!existingOAuth) {
              // Link this new OAuth account to the existing user
              await OAuthAccountModel.create({
                user_id: existingUser.id,
                provider: account.provider,
                provider_user_id: account.providerAccountId,
                profile_image: profileImageUrl || undefined,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at ? new Date(account.expires_at * 1000) : undefined,
              });
            }
          }
        } catch (error) {
          console.error('Error during sign in callback:', error);
          // Continue with sign in even if linking fails
        }
        return true;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = {
          id: token.user.id,
          name: token.user.name,
          email: token.user.email,
          image: token.user.image,
        };
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
};

export default NextAuth(authOptions);
