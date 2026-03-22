import { Pool, QueryResult, QueryResultRow } from 'pg';
import { Idem } from '../types/idem';

// Connection pool configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Generic query function
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

// Schema definition
const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS idems (
  id VARCHAR(50) PRIMARY KEY,
  author VARCHAR(50) NOT NULL,
  content VARCHAR(280) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_seeded BOOLEAN NOT NULL DEFAULT false
);
`;

// Migration to add is_seeded column to existing tables
const ADD_IS_SEEDED_COLUMN_SQL = `
ALTER TABLE idems ADD COLUMN IF NOT EXISTS is_seeded BOOLEAN NOT NULL DEFAULT false;
`;

const CREATE_INDEX_SQL = `
CREATE INDEX IF NOT EXISTS idx_idems_created_at ON idems(created_at DESC);
`;

// Initialize database schema on startup
export async function initializeDatabase(): Promise<void> {
  try {
    await pool.query(CREATE_TABLE_SQL);
    await pool.query(ADD_IS_SEEDED_COLUMN_SQL);
    await pool.query(CREATE_INDEX_SQL);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// Database row type (snake_case from PostgreSQL)
interface IdemRow {
  id: string;
  author: string;
  content: string;
  created_at: Date;
  is_seeded: boolean;
}

// Convert database row to Idem type
function rowToIdem(row: IdemRow): Idem {
  return {
    id: row.id,
    author: row.author,
    content: row.content,
    createdAt: row.created_at.toISOString(),
    isSeeded: row.is_seeded,
  };
}

// Get paginated idems sorted by created_at descending
export async function getIdems(page: number, pageSize: number, includeSeeded: boolean = true): Promise<Idem[]> {
  const offset = (page - 1) * pageSize;

  if (includeSeeded) {
    const result = await query<IdemRow>(
      'SELECT id, author, content, created_at, is_seeded FROM idems ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [pageSize, offset]
    );
    return result.rows.map(rowToIdem);
  } else {
    const result = await query<IdemRow>(
      'SELECT id, author, content, created_at, is_seeded FROM idems WHERE is_seeded = false ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [pageSize, offset]
    );
    return result.rows.map(rowToIdem);
  }
}

// Get total count of idems
export async function getTotalCount(includeSeeded: boolean = true): Promise<number> {
  if (includeSeeded) {
    const result = await query<{ count: string }>('SELECT COUNT(*) as count FROM idems');
    return parseInt(result.rows[0].count, 10);
  } else {
    const result = await query<{ count: string }>('SELECT COUNT(*) as count FROM idems WHERE is_seeded = false');
    return parseInt(result.rows[0].count, 10);
  }
}

// Insert a new idem directly into the database
export async function createIdem(idem: { id: string; author: string; content: string; createdAt: string }): Promise<void> {
  await query(
    'INSERT INTO idems (id, author, content, created_at, is_seeded) VALUES ($1, $2, $3, $4, false)',
    [idem.id, idem.author, idem.content, idem.createdAt]
  );
}

// Graceful shutdown
export async function closePool(): Promise<void> {
  await pool.end();
}
