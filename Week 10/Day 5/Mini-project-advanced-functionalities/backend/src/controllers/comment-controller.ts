import type { Request, Response } from 'express';
import { pool } from '../db/pool.js';
import { asyncHandler } from '../helpers/async-handler.js';
import { canEditStory, getStoryComments } from '../models/stories.js';

const allowedReactions = new Set(['like', 'love', 'laugh', 'celebrate']);

function parseId(value: unknown): number | undefined {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return undefined;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : undefined;
}

async function commentStoryId(commentId: number): Promise<number | undefined> {
  const result = await pool.query('SELECT story_id FROM comments WHERE id = $1', [commentId]);
  return result.rowCount ? Number(result.rows[0].story_id) : undefined;
}

export const listComments = asyncHandler(async (request: Request, response: Response) => {
  const storyId = parseId(request.params.storyId);
  if (!storyId) {
    response.status(400).json({ message: 'A valid story id is required.' });
    return;
  }
  const exists = await pool.query('SELECT 1 FROM stories WHERE id = $1', [storyId]);
  if (!exists.rowCount) {
    response.status(404).json({ message: 'Story not found.' });
    return;
  }
  if (!(await canEditStory(storyId, request.user!.id))) {
    response.status(403).json({ message: 'Only story collaborators can view comments.' });
    return;
  }
  response.json({ comments: await getStoryComments(storyId, request.user!.id) });
});

export const createComment = asyncHandler(async (request: Request, response: Response) => {
  const storyId = parseId(String(request.body?.story_id ?? ''));
  const text = request.body?.comment_text;
  if (!storyId || typeof text !== 'string' || !text.trim() || text.trim().length > 2000) {
    response.status(400).json({ message: 'Provide a valid story_id and comment_text (1-2,000 characters).' });
    return;
  }
  const story = await pool.query('SELECT comments_enabled FROM stories WHERE id = $1', [storyId]);
  if (!story.rowCount) {
    response.status(404).json({ message: 'Story not found.' });
    return;
  }
  if (!(await canEditStory(storyId, request.user!.id))) {
    response.status(403).json({ message: 'Only story collaborators can comment.' });
    return;
  }
  if (!story.rows[0].comments_enabled) {
    response.status(403).json({ message: 'Comments are disabled for this story.' });
    return;
  }
  await pool.query(
    'INSERT INTO comments (story_id, user_id, comment_text) VALUES ($1, $2, $3)',
    [storyId, request.user!.id, text.trim()],
  );
  response.status(201).json({ comments: await getStoryComments(storyId, request.user!.id) });
});

export const updateComment = asyncHandler(async (request: Request, response: Response) => {
  const commentId = parseId(request.params.id);
  const text = request.body?.comment_text;
  if (!commentId || typeof text !== 'string' || !text.trim() || text.trim().length > 2000) {
    response.status(400).json({ message: 'Provide a valid comment id and comment_text (1-2,000 characters).' });
    return;
  }
  const storyState = await pool.query(
    'SELECT s.comments_enabled FROM comments c JOIN stories s ON s.id = c.story_id WHERE c.id = $1',
    [commentId],
  );
  if (!storyState.rowCount) {
    response.status(404).json({ message: 'Comment not found.' });
    return;
  }
  if (!storyState.rows[0].comments_enabled) {
    response.status(403).json({ message: 'Comments are disabled for this story.' });
    return;
  }
  const result = await pool.query(
    'UPDATE comments SET comment_text = $1 WHERE id = $2 AND user_id = $3 RETURNING story_id',
    [text.trim(), commentId, request.user!.id],
  );
  if (!result.rowCount) {
    const exists = await commentStoryId(commentId);
    response.status(exists ? 403 : 404).json({ message: exists ? 'Only the comment author can edit it.' : 'Comment not found.' });
    return;
  }
  response.json({ comments: await getStoryComments(Number(result.rows[0].story_id), request.user!.id) });
});

export const deleteComment = asyncHandler(async (request: Request, response: Response) => {
  const commentId = parseId(request.params.id);
  if (!commentId) {
    response.status(400).json({ message: 'A valid comment id is required.' });
    return;
  }
  const result = await pool.query(
    `DELETE FROM comments c
     USING stories s
     WHERE c.id = $1
       AND s.id = c.story_id
       AND (c.user_id = $2 OR s.author_id = $2)
     RETURNING c.story_id`,
    [commentId, request.user!.id],
  );
  if (!result.rowCount) {
    const exists = await commentStoryId(commentId);
    response.status(exists ? 403 : 404).json({ message: exists ? 'Only the comment author or story author can delete it.' : 'Comment not found.' });
    return;
  }
  const storyId = Number(result.rows[0].story_id);
  response.json({ comments: await getStoryComments(storyId, request.user!.id) });
});

export const addReaction = asyncHandler(async (request: Request, response: Response) => {
  const commentId = parseId(request.params.id);
  const reaction = request.params.reaction;
  if (!commentId || typeof reaction !== 'string' || !allowedReactions.has(reaction)) {
    response.status(400).json({ message: 'A valid comment id and reaction are required.' });
    return;
  }
  const story = await pool.query(
    'SELECT c.story_id, s.comments_enabled FROM comments c JOIN stories s ON s.id = c.story_id WHERE c.id = $1',
    [commentId],
  );
  if (!story.rowCount) {
    response.status(404).json({ message: 'Comment not found.' });
    return;
  }
  const storyId = Number(story.rows[0].story_id);
  if (!story.rows[0].comments_enabled) {
    response.status(403).json({ message: 'Comments are disabled for this story.' });
    return;
  }
  if (!(await canEditStory(storyId, request.user!.id))) {
    response.status(403).json({ message: 'Only story collaborators can react to comments.' });
    return;
  }
  await pool.query(
    'INSERT INTO comment_reactions (comment_id, user_id, reaction) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
    [commentId, request.user!.id, reaction],
  );
  response.json({ comments: await getStoryComments(storyId, request.user!.id) });
});

export const removeReaction = asyncHandler(async (request: Request, response: Response) => {
  const commentId = parseId(request.params.id);
  const reaction = request.params.reaction;
  if (!commentId || typeof reaction !== 'string' || !allowedReactions.has(reaction)) {
    response.status(400).json({ message: 'A valid comment id and reaction are required.' });
    return;
  }
  const story = await pool.query(
    'SELECT c.story_id, s.comments_enabled FROM comments c JOIN stories s ON s.id = c.story_id WHERE c.id = $1',
    [commentId],
  );
  if (!story.rowCount) {
    response.status(404).json({ message: 'Comment not found.' });
    return;
  }
  const storyId = Number(story.rows[0].story_id);
  if (!story.rows[0].comments_enabled) {
    response.status(403).json({ message: 'Comments are disabled for this story.' });
    return;
  }
  if (!(await canEditStory(storyId, request.user!.id))) {
    response.status(403).json({ message: 'Only story collaborators can react to comments.' });
    return;
  }
  await pool.query(
    'DELETE FROM comment_reactions WHERE comment_id = $1 AND user_id = $2 AND reaction = $3',
    [commentId, request.user!.id, reaction],
  );
  response.json({ comments: await getStoryComments(storyId, request.user!.id) });
});
