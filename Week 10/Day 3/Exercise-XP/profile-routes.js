const express = require('express');

function createProfileRouter({ database, authenticate }) {
  const router = express.Router();

  router.get('/', authenticate, (request, response) => {
    return response.json({ user: request.user });
  });

  router.patch('/', authenticate, (request, response) => {
    const { username, displayName } = request.body || {};
    if (username === undefined && displayName === undefined) {
      return response.status(400).json({ error: 'Provide a username or display name to update.' });
    }
    if (username !== undefined && (typeof username !== 'string' || !/^[a-zA-Z0-9_-]{3,30}$/.test(username.trim()))) {
      return response.status(400).json({ error: 'Username must be 3-30 characters and use only letters, numbers, underscores, or hyphens.' });
    }
    if (displayName !== undefined && (typeof displayName !== 'string' || !displayName.trim() || displayName.trim().length > 80)) {
      return response.status(400).json({ error: 'Display name must be 1-80 characters.' });
    }

    try {
      database.prepare(`
        UPDATE users
        SET username = COALESCE(?, username),
            display_name = COALESCE(?, display_name),
            updated_at = ?
        WHERE id = ?
      `).run(
        username === undefined ? null : username.trim(),
        displayName === undefined ? null : displayName.trim(),
        new Date().toISOString(),
        request.user.id,
      );
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return response.status(409).json({ error: 'That username is already in use.' });
      }
      throw error;
    }

    const user = database.prepare(`
      SELECT id, username, email, display_name AS displayName, email_verified_at AS emailVerifiedAt
      FROM users
      WHERE id = ?
    `).get(request.user.id);
    return response.json({ user });
  });

  return router;
}

module.exports = createProfileRouter;
