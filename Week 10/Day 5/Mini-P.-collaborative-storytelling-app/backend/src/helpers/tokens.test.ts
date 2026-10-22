import assert from 'node:assert/strict';
import test from 'node:test';
import { createAccessToken, createRefreshToken, hashToken, verifyRefreshToken } from './tokens.js';

test('creates distinct, verifiable access and refresh tokens', () => {
  process.env.JWT_SECRET = 'test-access-secret-with-at-least-32-characters';
  process.env.REFRESH_SECRET = 'test-refresh-secret-with-at-least-32-characters';

  const accessToken = createAccessToken(42);
  const refresh = createRefreshToken(42);
  const claims = verifyRefreshToken(refresh.token);

  assert.equal(typeof accessToken, 'string');
  assert.equal(claims.sub, '42');
  assert.equal(claims.type, 'refresh');
  assert.equal(claims.familyId, refresh.familyId);
  assert.equal(hashToken(refresh.token), hashToken(refresh.token));
  assert.notEqual(hashToken(refresh.token), hashToken(accessToken));
});

test('rejects undersized JWT secrets', () => {
  process.env.JWT_SECRET = 'short';
  assert.throws(() => createAccessToken(1), /at least 32 characters/);
  process.env.JWT_SECRET = 'test-access-secret-with-at-least-32-characters';
});
