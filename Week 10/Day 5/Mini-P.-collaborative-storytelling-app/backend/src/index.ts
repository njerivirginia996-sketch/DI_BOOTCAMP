import 'dotenv/config';
import app from './app.js';
import { pool } from './db/pool.js';

const port = Number(process.env.PORT || 3001);

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be configured.');
}
for (const name of ['JWT_SECRET', 'REFRESH_SECRET'] as const) {
  if (!process.env[name] || process.env[name]!.length < 32) {
    throw new Error(`${name} must be configured with at least 32 characters.`);
  }
}

const server = app.listen(port, () => {
  console.log(`Collaborative storytelling API listening on port ${port}`);
});

function shutdown(): void {
  server.close(() => {
    void pool.end().finally(() => process.exit(0));
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
