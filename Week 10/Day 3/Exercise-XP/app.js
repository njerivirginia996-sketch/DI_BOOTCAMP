const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const createDatabase = require('./db');
const createAuthenticate = require('./auth-middleware').createAuthenticate;
const createAuthRouter = require('./auth-routes');
const createProfileRouter = require('./profile-routes');

function createApp({
  database = createDatabase(),
  accessTokenSecret = process.env.JWT_SECRET,
  refreshTokenSecret = process.env.JWT_REFRESH_SECRET,
  secureCookies = process.env.NODE_ENV === 'production',
} = {}) {
  if (typeof accessTokenSecret !== 'string' || accessTokenSecret.length < 32) {
    throw new Error('Set JWT_SECRET to a random secret of at least 32 characters.');
  }
  if (typeof refreshTokenSecret !== 'string' || refreshTokenSecret.length < 32) {
    throw new Error('Set JWT_REFRESH_SECRET to a separate random secret of at least 32 characters.');
  }

  const app = express();
  const authenticate = createAuthenticate(database, accessTokenSecret);

  app.disable('x-powered-by');
  app.use(bodyParser.json({ limit: '10kb' }));
  app.use(cookieParser());
  app.use('/api/auth', createAuthRouter({
    database,
    accessTokenSecret,
    refreshTokenSecret,
    secureCookies,
    authenticate,
  }));
  app.use('/api/profile', createProfileRouter({ database, authenticate }));
  app.use((error, request, response, next) => {
    console.error(error);
    if (response.headersSent) {
      return next(error);
    }
    return response.status(500).json({ error: 'An unexpected server error occurred.' });
  });

  return app;
}

module.exports = { createApp };
