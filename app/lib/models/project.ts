import { getDatabase } from '../db';

export interface Project {
  id: number;
  name: string;
  description: string;
  url: string;
  icon: string;
  color: string;
  category: string;
  featured: boolean;
  created_at: Date;
  updated_at: Date;
}

export class ProjectModel {
  static async findAll(): Promise<Project[]> {
    try {
      const sql = getDatabase();
      const result = await sql`
        SELECT * FROM projects 
        ORDER BY featured DESC, id ASC
      `;
      return result as Project[];
    } catch (error) {
      console.error('Error finding all projects:', error);
      return [];
    }
  }

  static async findById(id: number): Promise<Project | null> {
    try {
      const sql = getDatabase();
      const result = await sql`
        SELECT * FROM projects WHERE id = ${id}
      `;
      return (result as any)[0] as Project || null;
    } catch (error) {
      console.error('Error finding project by ID:', error);
      return null;
    }
  }

  static async create(data: {
    name: string;
    description: string;
    url: string;
    icon: string;
    color: string;
    category: string;
    featured?: boolean;
  }): Promise<Project | null> {
    try {
      const sql = getDatabase();
      const result = await sql`
        INSERT INTO projects (name, description, url, icon, color, category, featured)
        VALUES (${data.name}, ${data.description}, ${data.url}, ${data.icon}, ${data.color}, ${data.category}, ${data.featured || false})
        RETURNING *
      `;
      return (result as any)[0] as Project || null;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  }

  static async update(id: number, data: Partial<Pick<Project, 'name' | 'description' | 'url' | 'icon' | 'color' | 'category' | 'featured'>>): Promise<Project | null> {
    try {
      const sql = getDatabase();
      const result = await sql`
        UPDATE projects 
        SET 
          name = COALESCE(${data.name || null}, name),
          description = COALESCE(${data.description || null}, description),
          url = COALESCE(${data.url || null}, url),
          icon = COALESCE(${data.icon || null}, icon),
          color = COALESCE(${data.color || null}, color),
          category = COALESCE(${data.category || null}, category),
          featured = COALESCE(${data.featured || null}, featured),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
      return (result as any)[0] as Project || null;
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      const sql = getDatabase();
      await sql`DELETE FROM projects WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }

  static async findByCategory(category: string): Promise<Project[]> {
    try {
      const sql = getDatabase();
      const result = await sql`
        SELECT * FROM projects 
        WHERE category = ${category}
        ORDER BY featured DESC, created_at DESC
      `;
      return result as Project[];
    } catch (error) {
      console.error('Error finding projects by category:', error);
      return [];
    }
  }

  static async findFeatured(): Promise<Project[]> {
    try {
      const sql = getDatabase();
      const result = await sql`
        SELECT * FROM projects 
        WHERE featured = true
        ORDER BY created_at DESC
      `;
      return result as Project[];
    } catch (error) {
      console.error('Error finding featured projects:', error);
      return [];
    }
  }
}
