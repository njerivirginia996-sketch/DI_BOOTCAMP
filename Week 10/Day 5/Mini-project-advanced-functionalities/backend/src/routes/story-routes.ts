import { Router } from 'express';
import { createStoryShare, createStory, deleteStory, listStories, listStoryVersions, readStory, restoreStoryVersion, setCommentsEnabled, updateStory } from '../controllers/story-controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);
router.get('/', listStories);
router.post('/', createStory);
router.get('/:id/versions', listStoryVersions);
router.post('/:id/versions/:versionId/restore', restoreStoryVersion);
router.patch('/:id/comments/settings', setCommentsEnabled);
router.post('/:id/share', createStoryShare);
router.get('/:id', readStory);
router.patch('/:id', updateStory);
router.delete('/:id', deleteStory);

export default router;
