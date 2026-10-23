import { Router } from 'express';
import { getStoryByShareToken } from '../models/stories.js';

const router = Router();

router.get('/:token', async (request, response, next) => {
  try {
    const token = request.params.token;
    if (!/^[0-9a-f-]{36}$/i.test(token)) {
      response.status(404).json({ message: 'Shared story not found.' });
      return;
    }
    const story = await getStoryByShareToken(token);
    if (!story) {
      response.status(404).json({ message: 'Shared story not found.' });
      return;
    }
    response.json({
      story: {
        id: story.id,
        title: story.title,
        content: story.content,
        author: { id: story.author.id, name: story.author.name },
        createdAt: story.createdAt,
        updatedAt: story.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
