import { Router } from 'express';
import { addContributor, listContributors, removeContributor } from '../controllers/contributor-controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);
router.post('/', addContributor);
router.get('/:story_id', listContributors);
router.delete('/:id', removeContributor);

export default router;
