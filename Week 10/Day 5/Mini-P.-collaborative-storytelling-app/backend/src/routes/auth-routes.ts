import { Router } from 'express';
import { currentUser, login, logout, refresh, register, updateCurrentUser } from '../controllers/auth-controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticate, currentUser);
router.patch('/me', authenticate, updateCurrentUser);

export default router;
