import "dotenv/config";
import express, { Express } from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { env } from "./config";
import { logger } from "./utils/logger";
import sessionRoutes from "./routes/session.routes";
import userRoutes from "./routes/user.routes";
import messageRoutes from "./routes/message.routes";
import { initializeSessionSocket } from "./sockets/session.socket";
import { initializeEditorSocket } from "./sockets/editor.socket";

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/session", sessionRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);

initializeSessionSocket(io);
initializeEditorSocket(io);

app.get("", (req, res) => {
  return res.send("API is running");
});

const startServer = () => {
  server.listen(env.port, () => {
    logger.info(`Server is running on port ${env.port}`);
  });
};

startServer();
