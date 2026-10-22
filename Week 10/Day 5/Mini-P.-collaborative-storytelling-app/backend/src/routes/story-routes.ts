import { Router } from 'express';
import { addComment, createStory, deleteStory, listStories, listStoryVersions, readStory, restoreStoryVersion, updateStory } from '../controllers/story-controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);
router.get('/', listStories);
router.post('/', createStory);
router.get('/:id/versions', listStoryVersions);
router.post('/:id/versions/:versionId/restore', restoreStoryVersion);
router.get('/:id', readStory);
router.patch('/:id', updateStory);
router.delete('/:id', deleteStory);
router.post('/:id/comments', addComment);

export default router;
