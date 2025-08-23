import { neon } from '@neondatabase/serverless';

// Database connection - will be initialized when DATABASE_URL is available
let sql: ReturnType<typeof neon> | null = null;

// Initialize connection only when DATABASE_URL is available
if (process.env.DATABASE_URL) {
  sql = neon(process.env.DATABASE_URL);
}

// Helper function to get database connection
export function getDatabase() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined. Please set the DATABASE_URL environment variable.');
    }
    sql = neon(process.env.DATABASE_URL);
  }
  return sql;
}

export { sql };
export default sql;