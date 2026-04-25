import { Request, Response } from 'express';
import { getDirectMessagesBetween } from '../services/messageStore';

export class MessageController {
    static async getConversation(req: Request, res: Response) {
        try {
            const selectedUserId = parseInt(req.params.userId, 10);
            const currentUserIdRaw = req.query.currentUserId as string | undefined;
            const currentUserId = currentUserIdRaw ? parseInt(currentUserIdRaw, 10) : NaN;

            if (isNaN(selectedUserId) || isNaN(currentUserId)) {
                return res.status(400).json({ message: 'Both user IDs are required' });
            }

            const messages = getDirectMessagesBetween(currentUserId, selectedUserId);
            return res.json(messages);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
