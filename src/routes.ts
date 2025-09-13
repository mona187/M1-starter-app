import { Router } from 'express';

import { authenticateToken } from './auth.middleware';
import authRoutes from './auth.routes';
import hobbiesRoutes from './hobbies.routes';
import mediaRoutes from './media.routes';
import usersRoutes from './user.routes';
import weatherRoutes from './weather.routes';

const router = Router();

router.use('/auth', authRoutes);

router.use('/hobbies', authenticateToken, hobbiesRoutes);

router.use('/user', authenticateToken, usersRoutes);

router.use('/media', authenticateToken, mediaRoutes);

router.use('/weather', weatherRoutes);


export default router;
