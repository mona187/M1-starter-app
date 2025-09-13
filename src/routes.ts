import { Router } from 'express';

import { authenticateToken } from './shared/middleware/auth.middleware';
import authRoutes from './modules/auth/auth.routes';
import hobbiesRoutes from './modules/hobby/hobbies.routes';
import mediaRoutes from './modules/media/media.routes';
import usersRoutes from './modules/user/user.routes';
import weatherRoutes from './modules/weather/weather.routes';

const router = Router();

router.use('/auth', authRoutes);

router.use('/hobbies', authenticateToken, hobbiesRoutes);

router.use('/user', authenticateToken, usersRoutes);

router.use('/media', authenticateToken, mediaRoutes);

router.use('/weather', weatherRoutes);


export default router;
