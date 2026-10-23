import type { Server } from 'node:http';
import jwt from 'jsonwebtoken';
import { WebSocket, WebSocketServer } from 'ws';
import { pool } from '../db/pool.js';
import { canEditStory } from '../models/stories.js';
import type { Story } from '@story-app/types';
import { isAllowedFrontendOrigin } from '../helpers/origin.js';

interface AccessClaims extends jwt.JwtPayload {
  sub: string;
  type: 'access';
}

interface CursorMessage {
  type: 'cursor';
  position: number;
}

const rooms = new Map<number, Set<WebSocket>>();
const contexts = new WeakMap<WebSocket, { storyId: number; userId: number; name: string; expiresAt: number }>();

export function attachStorySockets(server: Server): void {
  const webSockets = new WebSocketServer({ noServer: true, maxPayload: 16 * 1024 });
  server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url || '/', 'http://localhost');
    const match = /^\/api\/ws\/stories\/([1-9]\d*)$/.exec(url.pathname);
    if (!match) {
      socket.destroy();
      return;
    }

    void (async () => {
      const reject = (status: number, message: string) => {
        socket.write(`HTTP/1.1 ${status} ${message}\r\nConnection: close\r\n\r\n`);
        socket.destroy();
      };
      if (request.headers.origin && !isAllowedFrontendOrigin(request.headers.origin)) {
        reject(403, 'Forbidden');
        return;
      }
      const secret = process.env.JWT_SECRET;
      const token = url.searchParams.get('token');
      if (!secret || !token) {
        reject(401, 'Unauthorized');
        return;
      }

      let claims: AccessClaims;
      try {
        const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
        if (typeof payload === 'string' || payload.type !== 'access' || !payload.sub) {
          reject(401, 'Unauthorized');
          return;
        }
        claims = payload as AccessClaims;
      } catch {
        reject(401, 'Unauthorized');
        return;
      }

      const storyId = Number(match[1]);
      const userId = Number(claims.sub);
      if (!Number.isSafeInteger(userId) || userId < 1 || !(await canEditStory(storyId, userId))) {
        reject(403, 'Forbidden');
        return;
      }
      const userResult = await pool.query(
        'SELECT name FROM users WHERE id = $1',
        [userId],
      );
      if (!userResult.rowCount) {
        reject(401, 'Unauthorized');
        return;
      }
      webSockets.handleUpgrade(request, socket, head, (webSocket) => {
        contexts.set(webSocket, {
          storyId,
          userId,
          name: userResult.rows[0].name as string,
          expiresAt: claims.exp ? claims.exp * 1000 : Date.now(),
        });
        webSockets.emit('connection', webSocket, request);
      });
    })().catch((error: unknown) => {
      console.error('Unable to authorize story socket:', error instanceof Error ? error.message : error);
      if (!socket.destroyed) {
        socket.write('HTTP/1.1 500 Internal Server Error\r\nConnection: close\r\n\r\n');
        socket.destroy();
      }
    });
  });

  webSockets.on('connection', (webSocket: WebSocket) => {
    const context = contexts.get(webSocket);
    if (!context) {
      webSocket.close(1011, 'Missing connection context');
      return;
    }
    const room = rooms.get(context.storyId) ?? new Set<WebSocket>();
    room.add(webSocket);
    rooms.set(context.storyId, room);
    const expiryTimer = setTimeout(
      () => webSocket.close(1008, 'Access token expired'),
      Math.max(0, context.expiresAt - Date.now()),
    );
    webSocket.send(JSON.stringify({ type: 'ready' }));

    webSocket.on('message', (data) => {
      let message: CursorMessage;
      try {
        message = JSON.parse(data.toString()) as CursorMessage;
      } catch {
        webSocket.close(1003, 'Invalid message');
        return;
      }
      if (message.type !== 'cursor' || !Number.isSafeInteger(message.position) || message.position < 0 || message.position > 50_000) {
        webSocket.close(1008, 'Unsupported message');
        return;
      }
      broadcast(context.storyId, {
        type: 'cursor',
        userId: context.userId,
        name: context.name,
        position: message.position,
      }, webSocket);
    });

    webSocket.on('close', () => {
      clearTimeout(expiryTimer);
      room.delete(webSocket);
      if (room.size === 0) rooms.delete(context.storyId);
    });
  });
}

function broadcast(storyId: number, payload: object, except?: WebSocket): void {
  const message = JSON.stringify(payload);
  for (const webSocket of rooms.get(storyId) ?? []) {
    if (webSocket !== except && webSocket.readyState === WebSocket.OPEN) webSocket.send(message);
  }
}

export function broadcastStoryUpdate(story: Story | undefined): void {
  if (story) broadcast(story.id, { type: 'story:update', story });
}

export function closeStoryConnections(storyId: number, userId: number): void {
  for (const webSocket of rooms.get(storyId) ?? []) {
    if (contexts.get(webSocket)?.userId === userId) webSocket.close(1008, 'Story access revoked');
  }
}
