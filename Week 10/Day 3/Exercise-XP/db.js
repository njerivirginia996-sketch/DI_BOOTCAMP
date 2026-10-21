const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

function createDatabase(databasePath = process.env.DATABASE_PATH || path.join(__dirname, 'data', 'auth.sqlite')) {
  if (databasePath !== ':memory:') {
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  }

  const database = new Database(databasePath);
  database.pragma('foreign_keys = ON');
  database.pragma('journal_mode = WAL');
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL COLLATE NOCASE UNIQUE,
      email TEXT NOT NULL COLLATE NOCASE UNIQUE,
      display_name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      email_verified_at TEXT,
      verification_token_hash TEXT,
      verification_expires_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS refresh_tokens (
      token_id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL,
      revoked_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS refresh_tokens_user_id ON refresh_tokens(user_id);
  `);

  return database;
}

module.exports = createDatabase;
