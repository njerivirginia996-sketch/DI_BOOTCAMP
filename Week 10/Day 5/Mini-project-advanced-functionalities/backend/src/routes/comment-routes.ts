import { Router } from 'express';
import { addReaction, createComment, deleteComment, listComments, removeReaction, updateComment } from '../controllers/comment-controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);
router.get('/:storyId', listComments);
router.post('/', createComment);
router.patch('/:id', updateComment);
router.delete('/:id', deleteComment);
router.put('/:id/reactions/:reaction', addReaction);
router.delete('/:id/reactions/:reaction', removeReaction);

export default router;
