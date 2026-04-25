import { Server, Socket } from "socket.io";
import { sessionService } from "../services/session.service";
import { EditorPayload } from "../types/interface";

const sessionActivityMessage = (username: string, action: string) => `${username} ${action}`;

export const initializeEditorSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    socket.on("editor_update", (payload: EditorPayload) => {
      const { sessionId, editorContent } = payload;
      const session = sessionService.updateEditor(sessionId, editorContent);

      if (!session) {
        socket.emit("activity", "Session not found");
        return;
      }

      socket.to(sessionId).emit("editor_update", editorContent);
      io.to(sessionId).emit("activity", sessionActivityMessage("A user", "updated the editor"));
    });
  });
};
