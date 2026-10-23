import assert from 'node:assert/strict';
import test from 'node:test';
import WebSocket from 'ws';
import app from './app.js';
import { attachStorySockets } from './realtime/story-sockets.js';

test('health check and protected API routes return expected status codes', async (context) => {
  const server = app.listen(0);
  attachStorySockets(server);
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const baseUrl = `http://127.0.0.1:${address.port}`;

  context.after(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  });

  const health = await fetch(`${baseUrl}/api/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: 'ok' });

  const protectedStories = await fetch(`${baseUrl}/api/stories`);
  assert.equal(protectedStories.status, 401);

  const vitePreflight = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'http://localhost:5178',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    },
  });
  assert.equal(vitePreflight.status, 204);
  assert.equal(vitePreflight.headers.get('access-control-allow-origin'), 'http://localhost:5178');
  assert.equal(vitePreflight.headers.get('access-control-allow-credentials'), 'true');

  const protectedComments = await fetch(`${baseUrl}/api/comments/1`);
  assert.equal(protectedComments.status, 401);

  const protectedCommentCreation = await fetch(`${baseUrl}/api/comments`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ story_id: 1, comment_text: 'Unauthenticated comment' }),
  });
  assert.equal(protectedCommentCreation.status, 401);

  const protectedAvatarUpload = await fetch(`${baseUrl}/api/auth/me/avatar`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ avatarUrl: 'data:image/png;base64,AA==' }),
  });
  assert.equal(protectedAvatarUpload.status, 401);

  const missingSharedStory = await fetch(`${baseUrl}/api/share/not-a-share-token`);
  assert.equal(missingSharedStory.status, 404);

  const invalidRegistration = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.equal(invalidRegistration.status, 400);

  const malformedJson = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{',
  });
  assert.equal(malformedJson.status, 400);

  const rejectedSocketStatus = await new Promise<number>((resolve, reject) => {
    const socket = new WebSocket(`ws://127.0.0.1:${address.port}/api/ws/stories/1`);
    const timeout = setTimeout(() => {
      socket.terminate();
      reject(new Error('Unauthenticated WebSocket was not rejected.'));
    }, 5000);
    socket.once('unexpected-response', (_request, response) => {
      clearTimeout(timeout);
      response.resume();
      resolve(response.statusCode ?? 0);
    });
    socket.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
  assert.equal(rejectedSocketStatus, 401);
});
