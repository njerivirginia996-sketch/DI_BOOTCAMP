const jwt = require('jsonwebtoken');

const issuer = 'week-10-day-3-auth';
const audience = 'week-10-day-3-api';

function verifyToken(token, secret, expectedType) {
  const payload = jwt.verify(token, secret, {
    algorithms: ['HS256'],
    issuer,
    audience,
  });

  if (typeof payload === 'string' || payload.type !== expectedType || !payload.sub) {
    throw new Error('Invalid token claims.');
  }

  return payload;
}

function createAuthenticate(database, accessTokenSecret) {
  return function authenticate(request, response, next) {
    const authorization = request.get('authorization') || '';
    const bearerToken = /^Bearer ([^\s]+)$/i.exec(authorization)?.[1];
    const token = request.cookies.accessToken || bearerToken;

    if (!token) {
      return response.status(401).json({ error: 'Authentication is required.' });
    }

    try {
      const payload = verifyToken(token, accessTokenSecret, 'access');
      const user = database.prepare(`
        SELECT id, username, email, display_name AS displayName, email_verified_at AS emailVerifiedAt
        FROM users
        WHERE id = ?
      `).get(Number(payload.sub));

      if (!user || !user.emailVerifiedAt) {
        return response.status(401).json({ error: 'The access token is not valid for an active account.' });
      }

      request.user = user;
      return next();
    } catch {
      return response.status(401).json({ error: 'The access token is invalid or expired.' });
    }
  };
}

module.exports = { audience, createAuthenticate, issuer, verifyToken };
