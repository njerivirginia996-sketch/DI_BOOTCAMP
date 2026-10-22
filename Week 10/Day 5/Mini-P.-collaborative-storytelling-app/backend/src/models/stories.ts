import type { QueryResultRow } from 'pg';
import type { Contributor, Story, StoryComment, StoryVersion, User } from '@story-app/types';
import { pool } from '../db/pool.js';

interface StoryRow extends QueryResultRow {
  id: string;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  author_id: string;
  author_name: string;
  author_email: string;
  contributors: Array<{ contributorId: string; id: string; name: string; email: string }> | null;
}

const storySelect = `
  SELECT s.id, s.title, s.content, s.created_at, s.updated_at,
         u.id AS author_id, u.name AS author_name, u.email AS author_email,
         COALESCE(
           json_agg(DISTINCT jsonb_build_object('contributorId', c.id, 'id', cu.id, 'name', cu.name, 'email', cu.email))
             FILTER (WHERE cu.id IS NOT NULL),
           '[]'
         ) AS contributors
  FROM stories s
  JOIN users u ON u.id = s.author_id
  LEFT JOIN contributors c ON c.story_id = s.id
  LEFT JOIN users cu ON cu.id = c.user_id
`;

function mapStory(row: StoryRow): Story {
  const author: User = {
    id: Number(row.author_id),
    name: row.author_name,
    email: row.author_email,
  };
  const contributors: Contributor[] = (row.contributors ?? []).map((contributor) => ({
    contributorId: Number(contributor.contributorId),
    id: Number(contributor.id),
    name: contributor.name,
    email: contributor.email,
  }));
  return {
    id: Number(row.id),
    title: row.title,
    content: row.content,
    author,
    contributors,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function getStories(userId: number, ownOnly: boolean): Promise<Story[]> {
  const result = await pool.query<StoryRow>(
    `${storySelect}
     GROUP BY s.id, u.id
     ${ownOnly ? 'HAVING s.author_id = $1 OR BOOL_OR(c.user_id = $1)' : ''}
     ORDER BY s.updated_at DESC`,
    ownOnly ? [userId] : [],
  );
  return result.rows.map(mapStory);
}

export async function getStoryById(storyId: number): Promise<Story | undefined> {
  const result = await pool.query<StoryRow>(
    `${storySelect}
     WHERE s.id = $1
     GROUP BY s.id, u.id`,
    [storyId],
  );
  return result.rows[0] ? mapStory(result.rows[0]) : undefined;
}

export async function canEditStory(storyId: number, userId: number): Promise<boolean> {
  const result = await pool.query(
    'SELECT 1 FROM stories s LEFT JOIN contributors c ON c.story_id = s.id WHERE s.id = $1 AND (s.author_id = $2 OR c.user_id = $2) LIMIT 1',
    [storyId, userId],
  );
  return result.rows.length > 0;
}

export async function isStoryAuthor(storyId: number, userId: number): Promise<boolean> {
  const result = await pool.query('SELECT 1 FROM stories WHERE id = $1 AND author_id = $2', [storyId, userId]);
  return result.rows.length > 0;
}

export async function getStoryComments(storyId: number): Promise<StoryComment[]> {
  const result = await pool.query(
    `SELECT c.id, c.story_id, c.body, c.created_at, u.id AS user_id, u.name, u.email
     FROM comments c JOIN users u ON u.id = c.user_id
     WHERE c.story_id = $1 ORDER BY c.created_at ASC`,
    [storyId],
  );
  return result.rows.map((row) => ({
    id: Number(row.id),
    storyId: Number(row.story_id),
    body: row.body,
    author: { id: Number(row.user_id), name: row.name, email: row.email },
    createdAt: row.created_at.toISOString(),
  }));
}

export async function getStoryVersions(storyId: number): Promise<StoryVersion[]> {
  const result = await pool.query(
    `SELECT v.id, v.story_id, v.title, v.content, v.created_at,
            u.id AS editor_id, u.name AS editor_name, u.email AS editor_email
     FROM story_versions v
     JOIN users u ON u.id = v.editor_id
     WHERE v.story_id = $1
     ORDER BY v.created_at DESC, v.id DESC`,
    [storyId],
  );
  return result.rows.map((row) => ({
    id: Number(row.id),
    storyId: Number(row.story_id),
    title: row.title,
    content: row.content,
    editor: { id: Number(row.editor_id), name: row.editor_name, email: row.editor_email },
    createdAt: row.created_at.toISOString(),
  }));
}
