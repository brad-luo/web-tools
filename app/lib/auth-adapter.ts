import { Adapter } from "next-auth/adapters";
import { UserModel, OAuthAccountModel, User, OAuthAccount } from "./models/user";
import { getProviderAvatarUrl } from "./user-utils";

export function NeonDatabaseAdapter(): Adapter {
  return {
    async createUser(user) {
      // First, check if a user with this email already exists
      const existingUser = await UserModel.findByEmail(user.email!);
      
      if (existingUser) {
        // Update the existing user with new profile info if available
        if (user.image && !existingUser.image) {
          await UserModel.update(existingUser.id, {
            username: user.name || existingUser.username,
            image: user.image
          });
          existingUser.username = user.name || existingUser.username;
          existingUser.image = user.image;
        }
        
        return {
          id: existingUser.id.toString(),
          email: existingUser.email,
          emailVerified: null,
          name: existingUser.username || null,
          image: existingUser.image || null,
        };
      }
      
      const newUser = await UserModel.create({
        email: user.email!,
        username: user.name || undefined,
        image: user.image || undefined,
      });
      
      if (!newUser) {
        throw new Error("Failed to create user");
      }

      return {
        id: newUser.id.toString(),
        email: newUser.email,
        emailVerified: null,
        name: newUser.username || null,
        image: newUser.image || null,
      };
    },

    async getUser(id) {
      const user = await UserModel.findById(parseInt(id));
      if (!user) return null;

      return {
        id: user.id.toString(),
        email: user.email,
        emailVerified: null,
        name: user.username || null,
        image: user.image || null,
      };
    },

    async getUserByEmail(email) {
      const user = await UserModel.findByEmail(email);
      if (!user) return null;

      return {
        id: user.id.toString(),
        email: user.email,
        emailVerified: null,
        name: user.username || null,
        image: user.image || null,
      };
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const oauthAccount = await OAuthAccountModel.findByProviderAndUserId(
        provider,
        providerAccountId
      );
      
      if (!oauthAccount) return null;

      const user = await UserModel.findById(oauthAccount.user_id);
      if (!user) return null;

      return {
        id: user.id.toString(),
        email: user.email,
        emailVerified: null,
        name: user.username || null,
        image: user.image || null,
      };
    },

    async updateUser(user) {
      const updatedUser = await UserModel.update(parseInt(user.id), {
        email: user.email || undefined,
        username: user.name || undefined,
        image: user.image || undefined,
      });

      if (!updatedUser) {
        throw new Error("Failed to update user");
      }

      return {
        id: updatedUser.id.toString(),
        email: updatedUser.email,
        emailVerified: null,
        name: updatedUser.username || null,
        image: updatedUser.image || null,
      };
    },

    async deleteUser(userId) {
      await UserModel.delete(parseInt(userId));
    },

    async linkAccount(account) {
      const user = await UserModel.findById(parseInt(account.userId));
      if (!user) {
        throw new Error("User not found");
      }

      // Check if this OAuth account is already linked to prevent duplicates
      const existingAccount = await OAuthAccountModel.findByProviderAndUserId(
        account.provider,
        account.providerAccountId
      );

      if (existingAccount) {
        // Update existing account with new tokens
        const updatedAccount = await OAuthAccountModel.update(
          account.provider,
          account.providerAccountId,
          {
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at ? new Date(account.expires_at * 1000) : undefined,
          }
        );

        if (!updatedAccount) {
          throw new Error("Failed to update OAuth account");
        }
      } else {
        // Create new OAuth account link
        const oauthAccount = await OAuthAccountModel.create({
          user_id: user.id,
          provider: account.provider,
          provider_user_id: account.providerAccountId,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at: account.expires_at ? new Date(account.expires_at * 1000) : undefined,
        });

        if (!oauthAccount) {
          throw new Error("Failed to link account");
        }
      }

      return {
        userId: user.id.toString(),
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
      };
    },

    async unlinkAccount({ providerAccountId, provider }) {
      await OAuthAccountModel.delete(provider, providerAccountId);
    },

    // Session management not needed for JWT strategy
    async createSession() {
      throw new Error("createSession not implemented - using JWT strategy");
    },

    async getSessionAndUser() {
      throw new Error("getSessionAndUser not implemented - using JWT strategy");
    },

    async updateSession() {
      throw new Error("updateSession not implemented - using JWT strategy");
    },

    async deleteSession() {
      throw new Error("deleteSession not implemented - using JWT strategy");
    },

    // Verification tokens not needed for OAuth flow
    async createVerificationToken() {
      throw new Error("createVerificationToken not implemented");
    },

    async useVerificationToken() {
      throw new Error("useVerificationToken not implemented");
    },
  };
}