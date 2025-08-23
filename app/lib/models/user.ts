import { getDatabase } from '../db';

export interface User {
  id: number;
  username?: string;
  email: string;
  image?: string;
  password_hash?: string;
  created_at: Date;
  updated_at: Date;
}

export interface OAuthAccount {
  id: number;
  user_id: number;
  provider: string;
  provider_user_id: string;
  profile_image?: string;
  access_token?: string;
  refresh_token?: string;
  expires_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  static async findById(id: number): Promise<User | null> {
    try {
      const sql = getDatabase();
      const result = await sql`
        SELECT * FROM users WHERE id = ${id}
      `;
      return (result as any)[0] as User || null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    try {
      const sql = getDatabase();
      const result = await sql`
        SELECT * FROM users WHERE email = ${email}
      `;
      return (result as any)[0] as User || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  static async create(data: {
    email: string;
    username?: string;
    image?: string;
    password_hash?: string;
  }): Promise<User | null> {
    try {
      const sql = getDatabase();
      const result = await sql`
        INSERT INTO users (email, username, image, password_hash)
        VALUES (${data.email}, ${data.username || null}, ${data.image || null}, ${data.password_hash || null})
        RETURNING *
      `;
      return (result as any)[0] as User || null;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  static async update(id: number, data: Partial<Pick<User, 'email' | 'username' | 'image'>>): Promise<User | null> {
    try {
      const sql = getDatabase();
      const result = await sql`
        UPDATE users 
        SET 
          email = COALESCE(${data.email || null}, email),
          username = COALESCE(${data.username || null}, username),
          image = COALESCE(${data.image || null}, image),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
      return (result as any)[0] as User || null;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      const sql = getDatabase();
      await sql`DELETE FROM users WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
}

export class OAuthAccountModel {
  static async findByProviderAndUserId(provider: string, providerUserId: string): Promise<OAuthAccount | null> {
    try {
      const sql = getDatabase();
      const result = await sql`
        SELECT * FROM oauth_accounts 
        WHERE provider = ${provider} AND provider_user_id = ${providerUserId}
      `;
      return (result as any)[0] as OAuthAccount || null;
    } catch (error) {
      console.error('Error finding OAuth account:', error);
      return null;
    }
  }

  static async findByUserId(userId: number): Promise<OAuthAccount[]> {
    try {
      const sql = getDatabase();
      const result = await sql`
        SELECT * FROM oauth_accounts WHERE user_id = ${userId}
      `;
      return result as OAuthAccount[];
    } catch (error) {
      console.error('Error finding OAuth accounts by user ID:', error);
      return [];
    }
  }

  static async create(data: {
    user_id: number;
    provider: string;
    provider_user_id: string;
    profile_image?: string;
    access_token?: string;
    refresh_token?: string;
    expires_at?: Date;
  }): Promise<OAuthAccount | null> {
    try {
      const sql = getDatabase();
      const result = await sql`
        INSERT INTO oauth_accounts (
          user_id, provider, provider_user_id, profile_image,
          access_token, refresh_token, expires_at
        )
        VALUES (
          ${data.user_id}, ${data.provider}, ${data.provider_user_id}, ${data.profile_image || null},
          ${data.access_token || null}, ${data.refresh_token || null}, 
          ${data.expires_at || null}
        )
        RETURNING *
      `;
      return (result as any)[0] as OAuthAccount || null;
    } catch (error) {
      console.error('Error creating OAuth account:', error);
      return null;
    }
  }

  static async update(
    provider: string, 
    providerUserId: string, 
    data: {
      access_token?: string;
      refresh_token?: string;
      expires_at?: Date;
    }
  ): Promise<OAuthAccount | null> {
    try {
      const sql = getDatabase();
      const result = await sql`
        UPDATE oauth_accounts 
        SET 
          access_token = COALESCE(${data.access_token || null}, access_token),
          refresh_token = COALESCE(${data.refresh_token || null}, refresh_token),
          expires_at = COALESCE(${data.expires_at || null}, expires_at),
          updated_at = CURRENT_TIMESTAMP
        WHERE provider = ${provider} AND provider_user_id = ${providerUserId}
        RETURNING *
      `;
      return (result as any)[0] as OAuthAccount || null;
    } catch (error) {
      console.error('Error updating OAuth account:', error);
      return null;
    }
  }

  static async delete(provider: string, providerUserId: string): Promise<boolean> {
    try {
      const sql = getDatabase();
      await sql`
        DELETE FROM oauth_accounts 
        WHERE provider = ${provider} AND provider_user_id = ${providerUserId}
      `;
      return true;
    } catch (error) {
      console.error('Error deleting OAuth account:', error);
      return false;
    }
  }
}