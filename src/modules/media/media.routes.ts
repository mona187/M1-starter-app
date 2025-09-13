import { Router } from 'express';

import { upload } from '../../shared/utils/storage';
import { authenticateToken } from '../../shared/middleware/auth.middleware';
import { MediaController } from './media.controller';

const router = Router();
const mediaController = new MediaController();

router.post(
  '/upload',
  authenticateToken,
  upload.single('media'),
  mediaController.uploadImage
);

export default router;
