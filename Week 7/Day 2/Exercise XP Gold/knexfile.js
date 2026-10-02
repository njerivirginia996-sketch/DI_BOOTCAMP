const path = require('node:path');

const filename = process.env.DB_PATH || path.join(__dirname, 'data', 'tasks.sqlite');

module.exports = {
  development: {
    client: 'better-sqlite3',
    connection: { filename },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, 'server', 'migrations'),
      extension: 'js',
    },
  },
};