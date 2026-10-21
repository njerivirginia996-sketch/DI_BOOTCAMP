const { createHash, randomBytes, randomUUID } = require('node:crypto');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { audience, issuer, verifyToken } = require('./auth-middleware');

const accessCookieName = 'accessToken';
const refreshCookieName = 'refreshToken';
const accessTokenLifetimeSeconds = 15 * 60;
const refreshTokenLifetimeSeconds = 7 * 24 * 60 * 60;

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

function cookieOptions(secure, path, maxAge) {
  return {
    httpOnly: true,
    secure,
    sameSite: 'strict',
    path,
    maxAge,
  };
}

function createAuthRouter({ database, accessTokenSecret, refreshTokenSecret, secureCookies, authenticate }) {
  const router = express.Router();
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login attempts. Try again in 15 minutes.' },
  });
  const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many refresh attempts. Try again later.' },
  });

  function issueAccessToken(userId) {
    return jwt.sign({ type: 'access' }, accessTokenSecret, {
      subject: String(userId),
      expiresIn: accessTokenLifetimeSeconds,
      issuer,
      audience,
      algorithm: 'HS256',
    });
  }

  function issueRefreshToken(userId) {
    const tokenId = randomUUID();
    const expiresAt = new Date(Date.now() + refreshTokenLifetimeSeconds * 1000).toISOString();
    const token = jwt.sign({ type: 'refresh' }, refreshTokenSecret, {
      subject: String(userId),
      jwtid: tokenId,
      expiresIn: refreshTokenLifetimeSeconds,
      issuer,
      audience,
      algorithm: 'HS256',
    });

    database.prepare(`
      INSERT INTO refresh_tokens (token_id, user_id, expires_at, created_at)
      VALUES (?, ?, ?, ?)
    `).run(tokenId, userId, expiresAt, new Date().toISOString());

    return token;
  }

  function setAuthCookies(response, userId) {
    const accessToken = issueAccessToken(userId);
    const refreshToken = issueRefreshToken(userId);
    response.cookie(accessCookieName, accessToken, cookieOptions(
      secureCookies,
      '/api',
      accessTokenLifetimeSeconds * 1000,
    ));
    response.cookie(refreshCookieName, refreshToken, cookieOptions(
      secureCookies,
      '/api/auth',
      refreshTokenLifetimeSeconds * 1000,
    ));
  }

  function clearAuthCookies(response) {
    response.clearCookie(accessCookieName, cookieOptions(secureCookies, '/api'));
    response.clearCookie(refreshCookieName, cookieOptions(secureCookies, '/api/auth'));
  }

  router.post('/register', async (request, response) => {
    const { username, email, password, displayName } = request.body || {};
    if (typeof username !== 'string' || !/^[a-zA-Z0-9_-]{3,30}$/.test(username)) {
      return response.status(400).json({ error: 'Username must be 3-30 characters and use only letters, numbers, underscores, or hyphens.' });
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return response.status(400).json({ error: 'A valid email address is required.' });
    }
    if (
      typeof password !== 'string'
      || password.length < 10
      || !/[a-z]/.test(password)
      || !/[A-Z]/.test(password)
      || !/\d/.test(password)
    ) {
      return response.status(400).json({ error: 'Password must be at least 10 characters and include uppercase, lowercase, and a number.' });
    }
    if (displayName !== undefined && (typeof displayName !== 'string' || !displayName.trim() || displayName.trim().length > 80)) {
      return response.status(400).json({ error: 'Display name must be 1-80 characters.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();
    const verificationToken = randomBytes(32).toString('base64url');
    const now = new Date();
    const verificationExpiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

    try {
      const passwordHash = await bcrypt.hash(password, 12);
      const result = database.prepare(`
        INSERT INTO users (
          username, email, display_name, password_hash, verification_token_hash,
          verification_expires_at, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        normalizedUsername,
        normalizedEmail,
        (displayName || normalizedUsername).trim(),
        passwordHash,
        hashToken(verificationToken),
        verificationExpiresAt,
        now.toISOString(),
        now.toISOString(),
      );

      const user = {
        id: Number(result.lastInsertRowid),
        username: normalizedUsername,
        email: normalizedEmail,
      };
      const payload = { message: 'Account created. Verify your email before logging in.', user };
      if (process.env.NODE_ENV !== 'production') {
        payload.verificationToken = verificationToken;
      }
      return response.status(201).json(payload);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return response.status(409).json({ error: 'That username or email is already registered.' });
      }
      throw error;
    }
  });

  router.post('/verify-email', (request, response) => {
    const { token } = request.body || {};
    if (typeof token !== 'string' || token.length < 32) {
      return response.status(400).json({ error: 'A valid verification token is required.' });
    }

    const user = database.prepare(`
      SELECT id, verification_expires_at AS expiresAt
      FROM users
      WHERE verification_token_hash = ? AND email_verified_at IS NULL
    `).get(hashToken(token));

    if (!user || Date.parse(user.expiresAt) <= Date.now()) {
      return response.status(400).json({ error: 'The verification token is invalid or expired.' });
    }

    database.prepare(`
      UPDATE users
      SET email_verified_at = ?, verification_token_hash = NULL,
          verification_expires_at = NULL, updated_at = ?
      WHERE id = ?
    `).run(new Date().toISOString(), new Date().toISOString(), user.id);
    return response.json({ message: 'Email verified. You can now log in.' });
  });

  router.post('/login', loginLimiter, async (request, response) => {
    const { email, password } = request.body || {};
    if (typeof email !== 'string' || typeof password !== 'string') {
      return response.status(400).json({ error: 'Email and password are required.' });
    }

    const user = database.prepare(`
      SELECT id, email, password_hash AS passwordHash, email_verified_at AS emailVerifiedAt
      FROM users
      WHERE email = ? COLLATE NOCASE
    `).get(email.trim());

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return response.status(401).json({ error: 'Invalid email or password.' });
    }
    if (!user.emailVerifiedAt) {
      return response.status(403).json({ error: 'Verify your email before logging in.' });
    }

    setAuthCookies(response, user.id);
    return response.json({ message: 'Logged in.' });
  });

  router.post('/refresh', refreshLimiter, (request, response) => {
    const refreshToken = request.cookies[refreshCookieName];
    if (!refreshToken) {
      return response.status(401).json({ error: 'A refresh token is required.' });
    }

    let payload;
    try {
      payload = verifyToken(refreshToken, refreshTokenSecret, 'refresh');
    } catch {
      clearAuthCookies(response);
      return response.status(401).json({ error: 'The refresh token is invalid or expired.' });
    }

    const rotateToken = database.transaction(() => {
      const storedToken = database.prepare(`
        SELECT user_id AS userId, expires_at AS expiresAt, revoked_at AS revokedAt
        FROM refresh_tokens
        WHERE token_id = ?
      `).get(payload.jti);
      if (
        !storedToken
        || storedToken.revokedAt
        || Date.parse(storedToken.expiresAt) <= Date.now()
        || storedToken.userId !== Number(payload.sub)
      ) {
        return false;
      }

      database.prepare('UPDATE refresh_tokens SET revoked_at = ? WHERE token_id = ?')
        .run(new Date().toISOString(), payload.jti);
      setAuthCookies(response, storedToken.userId);
      return true;
    });

    if (!rotateToken()) {
      clearAuthCookies(response);
      return response.status(401).json({ error: 'The refresh token has been revoked or is no longer valid.' });
    }
    return response.json({ message: 'Tokens refreshed.' });
  });

  router.post('/logout', (request, response) => {
    const refreshToken = request.cookies[refreshCookieName];
    if (refreshToken) {
      try {
        const payload = verifyToken(refreshToken, refreshTokenSecret, 'refresh');
        database.prepare(`
          UPDATE refresh_tokens
          SET revoked_at = COALESCE(revoked_at, ?)
          WHERE token_id = ? AND user_id = ?
        `).run(new Date().toISOString(), payload.jti, Number(payload.sub));
      } catch {
        // Clear browser cookies even if the refresh token has already expired.
      }
    }

    clearAuthCookies(response);
    return response.json({ message: 'Logged out.' });
  });

  router.get('/session', authenticate, (request, response) => {
    return response.json({ user: request.user });
  });

  return router;
}

module.exports = createAuthRouter;
