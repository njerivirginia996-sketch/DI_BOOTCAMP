import type { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { pool } from '../db/pool.js';
import { asyncHandler } from '../helpers/async-handler.js';
import { broadcastStoryUpdate } from '../realtime/story-sockets.js';
import { canEditStory, getStories, getStoryById, getStoryVersions, isStoryAuthor } from '../models/stories.js';

function parseId(raw: unknown): number | undefined {
  if (typeof raw !== 'string' || !/^[1-9]\d*$/.test(raw)) return undefined;
  const id = Number(raw);
  return Number.isSafeInteger(id) ? id : undefined;
}

function storyInput(request: Request): { title?: string; content?: string } | undefined {
  const { title, content } = request.body ?? {};
  if (
    (title !== undefined && (typeof title !== 'string' || !title.trim() || title.trim().length > 180))
    || (content !== undefined && (typeof content !== 'string' || content.length > 50_000))
  ) {
    return undefined;
  }
  return { title: title?.trim(), content };
}

export const listStories = asyncHandler(async (request: Request, response: Response) => {
  response.json({ stories: await getStories(request.user!.id, request.query.mine === 'true') });
});

export const readStory = asyncHandler(async (request: Request, response: Response) => {
  const id = parseId(request.params.id);
  if (!id) {
    response.status(400).json({ message: 'A valid story id is required.' });
    return;
  }
  const story = await getStoryById(id);
  if (!story) {
    response.status(404).json({ message: 'Story not found.' });
    return;
  }
  response.json({ story });
});

export const createStory = asyncHandler(async (request: Request, response: Response) => {
  const input = storyInput(request);
  if (!input || !input.title || input.content === undefined) {
    response.status(400).json({ message: 'A title and content are required. Titles may be up to 180 characters and content up to 50,000 characters.' });
    return;
  }
  const client = await pool.connect();
  let storyId: number;
  try {
    await client.query('BEGIN');
    const result = await client.query(
      'INSERT INTO stories (title, content, author_id) VALUES ($1, $2, $3) RETURNING id',
      [input.title, input.content, request.user!.id],
    );
    storyId = Number(result.rows[0].id);
    await client.query(
      'INSERT INTO story_versions (story_id, editor_id, title, content) VALUES ($1, $2, $3, $4)',
      [storyId, request.user!.id, input.title, input.content],
    );
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
  const story = await getStoryById(storyId);
  response.status(201).json({ story });
});

export const updateStory = asyncHandler(async (request: Request, response: Response) => {
  const id = parseId(request.params.id);
  const input = storyInput(request);
  if (!id || !input || (input.title === undefined && input.content === undefined)) {
    response.status(400).json({ message: 'Provide a valid story id and a title or content to update.' });
    return;
  }
  if (!(await canEditStory(id, request.user!.id))) {
    response.status(403).json({ message: 'Only the author or a contributor can edit this story.' });
    return;
  }
  const client = await pool.connect();
  let updated = false;
  try {
    await client.query('BEGIN');
    const current = await client.query(
      'SELECT title, content FROM stories WHERE id = $1 FOR UPDATE',
      [id],
    );
    if (current.rowCount) {
      await client.query(
        'INSERT INTO story_versions (story_id, editor_id, title, content) VALUES ($1, $2, $3, $4)',
        [id, request.user!.id, current.rows[0].title, current.rows[0].content],
      );
      await client.query(
        `UPDATE stories SET title = COALESCE($1, title), content = COALESCE($2, content), updated_at = NOW()
         WHERE id = $3`,
        [input.title ?? null, input.content ?? null, id],
      );
      updated = true;
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
  if (!updated) {
    response.status(404).json({ message: 'Story not found.' });
    return;
  }
  const story = await getStoryById(id);
  response.json({ story });
  broadcastStoryUpdate(story);
});

export const listStoryVersions = asyncHandler(async (request: Request, response: Response) => {
  const id = parseId(request.params.id);
  if (!id) {
    response.status(400).json({ message: 'A valid story id is required.' });
    return;
  }
  const story = await getStoryById(id);
  if (!story) {
    response.status(404).json({ message: 'Story not found.' });
    return;
  }
  if (!(await isStoryAuthor(id, request.user!.id))) {
    response.status(403).json({ message: 'Only the story author can view version history.' });
    return;
  }
  response.json({ versions: await getStoryVersions(id) });
});

export const restoreStoryVersion = asyncHandler(async (request: Request, response: Response) => {
  const id = parseId(request.params.id);
  const versionId = parseId(request.params.versionId);
  if (!id || !versionId) {
    response.status(400).json({ message: 'Valid story and version ids are required.' });
    return;
  }
  if (!(await isStoryAuthor(id, request.user!.id))) {
    response.status(403).json({ message: 'Only the story author can restore versions.' });
    return;
  }
  const client = await pool.connect();
  let restored = false;
  try {
    await client.query('BEGIN');
    const current = await client.query(
      'SELECT title, content FROM stories WHERE id = $1 FOR UPDATE',
      [id],
    );
    const snapshot = await client.query(
      'SELECT title, content FROM story_versions WHERE id = $1 AND story_id = $2',
      [versionId, id],
    );
    if (current.rowCount && snapshot.rowCount) {
      await client.query(
        'INSERT INTO story_versions (story_id, editor_id, title, content) VALUES ($1, $2, $3, $4)',
        [id, request.user!.id, current.rows[0].title, current.rows[0].content],
      );
      await client.query(
        'UPDATE stories SET title = $1, content = $2, updated_at = NOW() WHERE id = $3',
        [snapshot.rows[0].title, snapshot.rows[0].content, id],
      );
      restored = true;
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
  if (!restored) {
    response.status(404).json({ message: 'Story or version not found.' });
    return;
  }
  const story = await getStoryById(id);
  response.json({ story, versions: await getStoryVersions(id) });
  broadcastStoryUpdate(story);
});

export const deleteStory = asyncHandler(async (request: Request, response: Response) => {
  const id = parseId(request.params.id);
  if (!id) {
    response.status(400).json({ message: 'A valid story id is required.' });
    return;
  }
  if (!(await isStoryAuthor(id, request.user!.id))) {
    response.status(403).json({ message: 'Only the story author can delete it.' });
    return;
  }
  await pool.query('DELETE FROM stories WHERE id = $1', [id]);
  response.status(204).end();
});

export const setCommentsEnabled = asyncHandler(async (request: Request, response: Response) => {
  const id = parseId(request.params.id);
  const { enabled } = request.body ?? {};
  if (!id || typeof enabled !== 'boolean') {
    response.status(400).json({ message: 'A valid story id and boolean enabled value are required.' });
    return;
  }
  if (!(await isStoryAuthor(id, request.user!.id))) {
    const exists = await pool.query('SELECT 1 FROM stories WHERE id = $1', [id]);
    response.status(exists.rowCount ? 403 : 404).json({ message: exists.rowCount ? 'Only the story author can change comment settings.' : 'Story not found.' });
    return;
  }
  const result = await pool.query(
    'UPDATE stories SET comments_enabled = $1 WHERE id = $2 RETURNING id',
    [enabled, id],
  );
  if (!result.rowCount) {
    response.status(404).json({ message: 'Story not found.' });
    return;
  }
  response.json({ story: await getStoryById(id) });
});

export const createStoryShare = asyncHandler(async (request: Request, response: Response) => {
  const id = parseId(request.params.id);
  if (!id) {
    response.status(400).json({ message: 'A valid story id is required.' });
    return;
  }
  if (!(await canEditStory(id, request.user!.id))) {
    const exists = await pool.query('SELECT 1 FROM stories WHERE id = $1', [id]);
    response.status(exists.rowCount ? 403 : 404).json({ message: exists.rowCount ? 'Only story collaborators can create a share link.' : 'Story not found.' });
    return;
  }
  const token = randomUUID();
  const result = await pool.query(
    'UPDATE stories SET share_token = COALESCE(share_token, $1) WHERE id = $2 RETURNING share_token',
    [token, id],
  );
  const origin = process.env.FRONTEND_URL || 'http://localhost:5173';
  response.json({ url: `${origin.replace(/\/$/, '')}/share/${result.rows[0].share_token}` });
});
