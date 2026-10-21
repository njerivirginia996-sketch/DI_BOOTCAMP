const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { createApp } = require('../app');
const createDatabase = require('../db');

test('registration, email verification, cookie login, profile update, refresh rotation, and logout', async (context) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'jwt-auth-'));
  const database = createDatabase(path.join(directory, 'test.sqlite'));
  const app = createApp({
    database,
    accessTokenSecret: 'test-access-secret-that-is-long-enough-12345',
    refreshTokenSecret: 'test-refresh-secret-that-is-long-enough-12345',
    secureCookies: false,
  });
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  let cookieHeader = '';

  context.after(async () => {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    database.close();
    fs.rmSync(directory, { recursive: true, force: true });
  });

  async function request(url, options = {}) {
    const response = await fetch(`${baseUrl}${url}`, {
      ...options,
      headers: {
        ...(options.body ? { 'content-type': 'application/json' } : {}),
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
        ...options.headers,
      },
    });
    const setCookie = response.headers.getSetCookie();
    for (const cookie of setCookie) {
      const [pair] = cookie.split(';');
      const [name] = pair.split('=');
      const cookies = new Map(cookieHeader.split('; ').filter(Boolean).map((item) => item.split('=')));
      if (/Max-Age=0/i.test(cookie)) {
        cookies.delete(name);
      } else {
        cookies.set(name, pair.slice(name.length + 1));
      }
      cookieHeader = [...cookies].map(([key, value]) => `${key}=${value}`).join('; ');
    }
    return response;
  }

  const invalidRegistration = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username: 'x', email: 'not-an-email', password: 'weak' }),
  });
  assert.equal(invalidRegistration.status, 400);

  const registration = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      username: 'reader_1',
      email: 'reader@example.com',
      password: 'StrongPassword1',
      displayName: 'First Reader',
    }),
  });
  assert.equal(registration.status, 201);
  const { verificationToken } = await registration.json();

  const unverifiedLogin = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'reader@example.com', password: 'StrongPassword1' }),
  });
  assert.equal(unverifiedLogin.status, 403);

  const verification = await request('/api/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token: verificationToken }),
  });
  assert.equal(verification.status, 200);

  const login = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'reader@example.com', password: 'StrongPassword1' }),
  });
  assert.equal(login.status, 200);
  assert.match(cookieHeader, /accessToken=/);
  assert.match(cookieHeader, /refreshToken=/);

  const profile = await request('/api/profile');
  assert.equal(profile.status, 200);
  assert.equal((await profile.json()).user.username, 'reader_1');

  const update = await request('/api/profile', {
    method: 'PATCH',
    body: JSON.stringify({ displayName: 'Updated Reader' }),
  });
  assert.equal((await update.json()).user.displayName, 'Updated Reader');

  const previousRefreshToken = cookieHeader.match(/(?:^|; )refreshToken=([^;]+)/)[1];
  const refresh = await request('/api/auth/refresh', { method: 'POST' });
  assert.equal(refresh.status, 200);
  const currentRefreshToken = cookieHeader.match(/(?:^|; )refreshToken=([^;]+)/)[1];
  assert.notEqual(currentRefreshToken, previousRefreshToken);

  cookieHeader = `refreshToken=${previousRefreshToken}`;
  const reusedRefresh = await request('/api/auth/refresh', { method: 'POST' });
  assert.equal(reusedRefresh.status, 401);

  cookieHeader = `refreshToken=${currentRefreshToken}`;
  const logout = await request('/api/auth/logout', { method: 'POST' });
  assert.equal(logout.status, 200);
  const afterLogout = await request('/api/auth/refresh', { method: 'POST' });
  assert.equal(afterLogout.status, 401);
});
