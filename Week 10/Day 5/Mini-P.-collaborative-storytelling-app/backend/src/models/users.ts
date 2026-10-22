import type { QueryResultRow } from 'pg';
import { pool } from '../db/pool.js';

export interface UserRow extends QueryResultRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
}

export async function findUserByEmail(email: string): Promise<UserRow | undefined> {
  const result = await pool.query<UserRow>(
    'SELECT id, name, email, password_hash FROM users WHERE email = $1',
    [email],
  );
  return result.rows[0];
}

export async function createUser(name: string, email: string, passwordHash: string): Promise<UserRow> {
  const result = await pool.query<UserRow>(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, password_hash',
    [name, email, passwordHash],
  );
  return result.rows[0];
}
