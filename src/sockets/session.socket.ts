import { Server, Socket } from "socket.io";
import { sessionService } from "../services/session.service";
import { User, Message, ConnectedUser, JoinPayload, MessagePayload } from "../types/interface";
import { addDirectMessage } from "../services/messageStore";
import { logger } from "../utils/logger";

const sessionActivityMessage = (username: string, action: string) => `${username} ${action}`;

const connectedUsers = new Map<string, ConnectedUser>();

export const getConnectedUsers = () => {
  return Array.from(connectedUsers.values()).map((user) => ({
    id: user.userId,
    username: user.username,
    name: user.username,
  }));
};

export const initializeSessionSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    logger.info("Socket connected", { socketId: socket.id });

    socket.on("join-room", (payload: ConnectedUser) => {
      if (!payload || typeof payload.userId !== 'number' || typeof payload.username !== 'string') {
        return;
      }

      socket.join("chat-room");
      connectedUsers.set(socket.id, payload);
      io.emit("user-status", { userId: payload.userId, status: "online" });
    });

    socket.on("message", (payload: { senderId: number; recipientId: number; content: string }) => {
      if (!payload?.senderId || !payload?.recipientId || !payload?.content) {
        return;
      }

      const messageItem = {
        senderId: payload.senderId,
        recipientId: payload.recipientId,
        content: payload.content,
        createdAt: new Date().toISOString(),
      };

      addDirectMessage(messageItem);
      io.to("chat-room").emit("message", messageItem);
    });

    socket.on("join_session", (payload: JoinPayload) => {
      const { sessionId, username } = payload;
      const session = sessionService.getSession(sessionId);

      if (!session) {
        socket.emit("activity", "Session not found");
        return;
      }

      if (session.users.some((user) => user.username === username)) {
        socket.emit("activity", "Username already joined");
        return;
      }

      const user: User = { socketId: socket.id, username };
      sessionService.addUser(sessionId, user);
      socket.join(sessionId);

      io.to(sessionId).emit("users_update", session.users);
      io.to(sessionId).emit("activity", sessionActivityMessage(username, "joined the session"));
    });

    socket.on("leave_session", (payload: JoinPayload) => {
      const { sessionId, username } = payload;
      const session = sessionService.removeUser(sessionId, socket.id);

      if (!session) {
        socket.emit("activity", "Session or user not found");
        return;
      }

      socket.leave(sessionId);
      io.to(sessionId).emit("users_update", session.users);
      io.to(sessionId).emit("activity", sessionActivityMessage(username, "left the session"));
    });

    socket.on("send_message", (payload: MessagePayload) => {
      const { sessionId, user, message } = payload;
      const session = sessionService.getSession(sessionId);

      if (!session) {
        socket.emit("activity", "Session not found");
        return;
      }

      const messageItem: Message = {
        user,
        message,
        timestamp: Date.now(),
      };

      sessionService.addMessage(sessionId, messageItem);
      io.to(sessionId).emit("new_message", messageItem);
      io.to(sessionId).emit("activity", sessionActivityMessage(user, "sent a message"));
    });

    socket.on("disconnect", () => {
      const connectedUser = connectedUsers.get(socket.id);
      if (connectedUser) {
        io.emit("user-status", { userId: connectedUser.userId, status: "offline" });
        connectedUsers.delete(socket.id);
      }

      const session = sessionService.getSessionBySocket(socket.id);
      if (!session) {
        return;
      }

      const user = session.users.find((current) => current.socketId === socket.id);
      sessionService.removeUser(session.id, socket.id);

      if (user) {
        io.to(session.id).emit("users_update", session.users);
        io.to(session.id).emit("activity", sessionActivityMessage(user.username, "disconnected"));
      }
    });
  });
};
