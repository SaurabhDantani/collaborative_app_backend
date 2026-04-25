import { Request, Response } from "express";
import { sessionService } from "../services/session.service";
import { CreateSessionBody, JoinSessionBody, Session } from "../types/interface";
import { randomUUID } from "crypto";

export class SessionController {
  static createSession(req: Request<{}, {}, CreateSessionBody>, res: Response) {
    const { username } = req.body;

    if (!username?.trim()) {
      return res.status(400).json({ error: "username is required" });
    }

    const sessionId = randomUUID();
    const session: Session = sessionService.createSession(sessionId);

    return res.status(201).json(session);
  }

  static joinSession(req: Request<{}, {}, JoinSessionBody>, res: Response) {
    const { sessionId, username } = req.body;

    if (!sessionId?.trim() || !username?.trim()) {
      return res.status(400).json({ error: "sessionId and username are required" });
    }

    const session = sessionService.getSession(sessionId.trim());
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.users.some((user) => user.username === username.trim())) {
      return res.status(409).json({ error: "Username already in session" });
    }

    return res.status(200).json(session);
  }

  static getSession(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    const session = sessionService.getSession(id);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    return res.status(200).json(session);
  }
}
