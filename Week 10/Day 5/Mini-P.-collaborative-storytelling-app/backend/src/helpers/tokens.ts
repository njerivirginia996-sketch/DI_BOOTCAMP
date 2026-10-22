import { createHash, randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import type { Response } from 'express';

const accessLifetime = '15m';
const refreshLifetimeSeconds = 7 * 24 * 60 * 60;

function requiredSecret(name: 'JWT_SECRET' | 'REFRESH_SECRET'): string {
  const secret = process.env[name];
  if (!secret || secret.length < 32) {
    throw new Error(`${name} must be configured with at least 32 characters.`);
  }
  return secret;
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function createAccessToken(userId: number): string {
  return jwt.sign({ type: 'access' }, requiredSecret('JWT_SECRET'), {
    subject: String(userId),
    expiresIn: accessLifetime,
    algorithm: 'HS256',
  });
}

export interface RefreshClaims extends jwt.JwtPayload {
  sub: string;
  jti: string;
  familyId: string;
  type: 'refresh';
}

export function createRefreshToken(userId: number, familyId = randomUUID()): {
  token: string;
  familyId: string;
  expiresAt: Date;
} {
  const jti = randomUUID();
  return {
    token: jwt.sign({ type: 'refresh', familyId }, requiredSecret('REFRESH_SECRET'), {
      subject: String(userId),
      jwtid: jti,
      expiresIn: refreshLifetimeSeconds,
      algorithm: 'HS256',
    }),
    familyId,
    expiresAt: new Date(Date.now() + refreshLifetimeSeconds * 1000),
  };
}

export function verifyRefreshToken(token: string): RefreshClaims {
  const payload = jwt.verify(token, requiredSecret('REFRESH_SECRET'), {
    algorithms: ['HS256'],
  });
  if (
    typeof payload === 'string'
    || payload.type !== 'refresh'
    || !payload.sub
    || !payload.jti
    || !payload.familyId
  ) {
    throw new Error('Invalid refresh token claims.');
  }
  return payload as RefreshClaims;
}

export function setRefreshCookie(response: Response, token: string): void {
  response.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth',
    maxAge: refreshLifetimeSeconds * 1000,
  });
}

export function clearRefreshCookie(response: Response): void {
  response.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth',
  });
}
