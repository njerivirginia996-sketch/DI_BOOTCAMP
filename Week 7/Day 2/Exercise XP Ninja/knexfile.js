const path = require('node:path');

const filename = process.env.DB_PATH || path.join(__dirname, 'data', 'quiz.sqlite');

module.exports = {
  development: {
    client: 'better-sqlite3',
    connection: { filename },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, 'server', 'migrations'),
      extension: 'js',
    },
    seeds: {
      directory: path.join(__dirname, 'server', 'seeds'),
      extension: 'js',
    },
    pool: {
      afterCreate(connection, done) {
        connection.pragma('foreign_keys = ON');
        done(null, connection);
      },
    },
  },
};