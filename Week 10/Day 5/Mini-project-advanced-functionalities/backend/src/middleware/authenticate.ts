import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { pool } from '../db/pool.js';

export async function authenticate(request: Request, response: Response, next: NextFunction): Promise<void> {
  const authorization = request.get('authorization') || '';
  const token = /^Bearer ([^\s]+)$/i.exec(authorization)?.[1];
  if (!token) {
    response.status(401).json({ message: 'Authentication is required.' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      throw new Error('JWT_SECRET is not configured.');
    }
    const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
    if (typeof payload === 'string' || payload.type !== 'access' || !payload.sub) {
      response.status(401).json({ message: 'The access token is invalid or expired.' });
      return;
    }

    const userId = Number(payload.sub);
    if (!Number.isSafeInteger(userId) || userId <= 0) {
      response.status(401).json({ message: 'The access token is invalid or expired.' });
      return;
    }

    const result = await pool.query(
      'SELECT id, name, email, avatar_url FROM users WHERE id = $1',
      [userId],
    );
    if (!result.rowCount) {
      response.status(401).json({ message: 'The account for this token no longer exists.' });
      return;
    }
    request.user = {
      id: Number(result.rows[0].id),
      name: result.rows[0].name,
      email: result.rows[0].email,
      avatarUrl: result.rows[0].avatar_url as string | null,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      response.status(401).json({ message: 'The access token is invalid or expired.' });
      return;
    }
    next(error);
  }
}
