import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';

const router = Router();

router.get('/:userId', MessageController.getConversation);

export default router;
