import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { pool } from '../db/pool.js';
import { asyncHandler } from '../helpers/async-handler.js';
import { clearRefreshCookie, createAccessToken, createRefreshToken, hashToken, setRefreshCookie, verifyRefreshToken } from '../helpers/tokens.js';
import { createUser, findUserByEmail } from '../models/users.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameIsValid = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0 && value.trim().length <= 100;

async function startSession(userId: number, response: Response): Promise<void> {
  const refresh = createRefreshToken(userId);
  await pool.query(
    'INSERT INTO refresh_tokens (token_hash, family_id, user_id, expires_at) VALUES ($1, $2, $3, $4)',
    [hashToken(refresh.token), refresh.familyId, userId, refresh.expiresAt],
  );
  setRefreshCookie(response, refresh.token);
}

export const register = asyncHandler(async (request: Request, response: Response) => {
  const { name, email, password } = request.body ?? {};
  if (
    !nameIsValid(name)
    || typeof email !== 'string'
    || !emailPattern.test(email.trim())
    || typeof password !== 'string'
    || password.length < 10
    || !/[a-z]/.test(password)
    || !/[A-Z]/.test(password)
    || !/\d/.test(password)
  ) {
    response.status(400).json({
      message: 'Provide a valid name and email. Passwords need at least 10 characters, including uppercase, lowercase, and a number.',
    });
    return;
  }

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const user = await createUser(normalizedName, normalizedEmail, passwordHash);
    await startSession(Number(user.id), response);
    response.status(201).json({
      accessToken: createAccessToken(Number(user.id)),
      user: { id: Number(user.id), name: user.name, email: user.email },
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      response.status(409).json({ message: 'That email is already registered.' });
      return;
    }
    throw error;
  }
});

export const login = asyncHandler(async (request: Request, response: Response) => {
  const { email, password } = request.body ?? {};
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    response.status(400).json({ message: 'Email and password are required.' });
    return;
  }
  const user = await findUserByEmail(email.trim().toLowerCase());
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    response.status(401).json({ message: 'Invalid email or password.' });
    return;
  }

  await startSession(Number(user.id), response);
  response.json({
    accessToken: createAccessToken(Number(user.id)),
    user: { id: Number(user.id), name: user.name, email: user.email },
  });
});

export const refresh = asyncHandler(async (request: Request, response: Response) => {
  const token = request.cookies?.refreshToken;
  if (typeof token !== 'string') {
    response.status(401).json({ message: 'A refresh token is required.' });
    return;
  }

  let claims;
  try {
    claims = verifyRefreshToken(token);
  } catch {
    clearRefreshCookie(response);
    response.status(401).json({ message: 'The refresh token is invalid or expired.' });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const current = await client.query(
      `SELECT id, user_id, family_id, revoked_at
       FROM refresh_tokens
       WHERE token_hash = $1
       FOR UPDATE`,
      [hashToken(token)],
    );
    const record = current.rows[0];
    if (
      !record
      || Number(record.user_id) !== Number(claims.sub)
      || record.family_id !== claims.familyId
    ) {
      await client.query('ROLLBACK');
      clearRefreshCookie(response);
      response.status(401).json({ message: 'The refresh token is no longer valid.' });
      return;
    }

    if (record.revoked_at) {
      await client.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE family_id = $1 AND revoked_at IS NULL', [record.family_id]);
      await client.query('COMMIT');
      clearRefreshCookie(response);
      response.status(401).json({ message: 'This session has been revoked. Please log in again.' });
      return;
    }

    await client.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1', [record.id]);
    const nextToken = createRefreshToken(Number(record.user_id), record.family_id);
    await client.query(
      'INSERT INTO refresh_tokens (token_hash, family_id, user_id, expires_at) VALUES ($1, $2, $3, $4)',
      [hashToken(nextToken.token), nextToken.familyId, Number(record.user_id), nextToken.expiresAt],
    );
    await client.query('COMMIT');
    setRefreshCookie(response, nextToken.token);
    response.json({ accessToken: createAccessToken(Number(record.user_id)) });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

export const logout = asyncHandler(async (request: Request, response: Response) => {
  const token = request.cookies?.refreshToken;
  if (typeof token === 'string') {
    try {
      const claims = verifyRefreshToken(token);
      await pool.query(
        'UPDATE refresh_tokens SET revoked_at = COALESCE(revoked_at, NOW()) WHERE token_hash = $1 AND user_id = $2',
        [hashToken(token), Number(claims.sub)],
      );
    } catch {
      // Expired or malformed cookies still need to be cleared client-side.
    }
  }
  clearRefreshCookie(response);
  response.json({ message: 'Logged out.' });
});

export const currentUser = (request: Request, response: Response): void => {
  response.json({ user: request.user });
};

export const updateCurrentUser = asyncHandler(async (request: Request, response: Response) => {
  const { name, email } = request.body ?? {};
  if (
    (name !== undefined && !nameIsValid(name))
    || (email !== undefined && (typeof email !== 'string' || !emailPattern.test(email.trim())))
    || (name === undefined && email === undefined)
  ) {
    response.status(400).json({ message: 'Provide a valid name or email address to update.' });
    return;
  }
  try {
    const result = await pool.query(
      `UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email)
       WHERE id = $3 RETURNING id, name, email`,
      [
        name === undefined ? null : name.trim(),
        email === undefined ? null : email.trim().toLowerCase(),
        request.user!.id,
      ],
    );
    if (!result.rowCount) {
      response.status(404).json({ message: 'Account not found.' });
      return;
    }
    response.json({
      user: {
        id: Number(result.rows[0].id),
        name: result.rows[0].name,
        email: result.rows[0].email,
      },
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      response.status(409).json({ message: 'That email is already in use.' });
      return;
    }
    throw error;
  }
});

function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505';
}
