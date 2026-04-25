import { Router } from "express";
import { SessionController } from "../controllers/session.controller";

const router = Router();

router.post("/create", SessionController.createSession);
router.post("/join", SessionController.joinSession);
router.get("/:id", SessionController.getSession);

export default router;
