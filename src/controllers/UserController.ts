import { Request, Response } from 'express';
import { getConnectedUsers } from '../sockets/session.socket';

export class UserController {
    static async getAllUsers(req: Request, res: Response) {
        try {
            const users = getConnectedUsers();
            return res.json(users);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
