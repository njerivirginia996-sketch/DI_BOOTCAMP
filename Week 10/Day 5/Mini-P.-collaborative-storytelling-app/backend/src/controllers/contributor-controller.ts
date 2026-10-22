import type { Request, Response } from 'express';
import { pool } from '../db/pool.js';
import { asyncHandler } from '../helpers/async-handler.js';
import { isStoryAuthor } from '../models/stories.js';

function positiveId(value: unknown): number | undefined {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return undefined;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : undefined;
}

export const addContributor = asyncHandler(async (request: Request, response: Response) => {
  const { story_id: storyIdValue, user_id: userIdValue } = request.body ?? {};
  const storyId = positiveId(String(storyIdValue ?? ''));
  const userId = positiveId(String(userIdValue ?? ''));
  if (!storyId || !userId) {
    response.status(400).json({ message: 'Valid story_id and user_id values are required.' });
    return;
  }
  if (!(await isStoryAuthor(storyId, request.user!.id))) {
    response.status(403).json({ message: 'Only the story author can add contributors.' });
    return;
  }
  if (userId === request.user!.id) {
    response.status(400).json({ message: 'The story author is already a collaborator.' });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO contributors (story_id, user_id)
       SELECT $1, u.id FROM users u WHERE u.id = $2
       ON CONFLICT (story_id, user_id) DO NOTHING
       RETURNING id`,
      [storyId, userId],
    );
    if (!result.rowCount) {
      const storyExists = await pool.query('SELECT 1 FROM stories WHERE id = $1', [storyId]);
      const userExists = await pool.query('SELECT 1 FROM users WHERE id = $1', [userId]);
      response.status(404).json({ message: !storyExists.rowCount ? 'Story not found.' : !userExists.rowCount ? 'User not found.' : 'That user is already a contributor.' });
      return;
    }
    response.status(201).json({ id: Number(result.rows[0].id), storyId, userId });
  } catch (error) {
    throw error;
  }
});

export const listContributors = asyncHandler(async (request: Request, response: Response) => {
  const storyId = positiveId(request.params.story_id);
  if (!storyId) {
    response.status(400).json({ message: 'A valid story id is required.' });
    return;
  }
  const story = await pool.query('SELECT author_id FROM stories WHERE id = $1', [storyId]);
  if (!story.rowCount) {
    response.status(404).json({ message: 'Story not found.' });
    return;
  }
  const canView = Number(story.rows[0].author_id) === request.user!.id
    || (await pool.query('SELECT 1 FROM contributors WHERE story_id = $1 AND user_id = $2', [storyId, request.user!.id])).rows.length > 0;
  if (!canView) {
    response.status(403).json({ message: 'You do not have access to this story.' });
    return;
  }
  const result = await pool.query(
    `SELECT c.id, u.id AS user_id, u.name, u.email
     FROM contributors c JOIN users u ON u.id = c.user_id
     WHERE c.story_id = $1 ORDER BY c.added_at`,
    [storyId],
  );
  response.json({
    contributors: result.rows.map((row) => ({
      id: Number(row.id),
      user: { id: Number(row.user_id), name: row.name, email: row.email },
    })),
  });
});

export const removeContributor = asyncHandler(async (request: Request, response: Response) => {
  const contributorId = positiveId(request.params.id);
  if (!contributorId) {
    response.status(400).json({ message: 'A valid contributor id is required.' });
    return;
  }
  const contributor = await pool.query(
    'SELECT id, story_id FROM contributors WHERE id = $1',
    [contributorId],
  );
  if (!contributor.rowCount) {
    response.status(404).json({ message: 'Contributor not found.' });
    return;
  }
  if (!(await isStoryAuthor(Number(contributor.rows[0].story_id), request.user!.id))) {
    response.status(403).json({ message: 'Only the story author can remove contributors.' });
    return;
  }
  await pool.query('DELETE FROM contributors WHERE id = $1', [contributorId]);
  response.status(204).end();
});
