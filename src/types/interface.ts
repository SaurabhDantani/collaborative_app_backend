export interface User {
  socketId: string;
  username: string;
}

export interface Message {
  user: string;
  message: string;
  timestamp: number;
}

export interface Session {
  id: string;
  users: User[];
  messages: Message[];
  editorContent: string;
}

export interface CreateSessionBody {
  username: string;
}

export interface JoinSessionBody {
  sessionId: string;
  username: string;
}

export interface StoredMessage {
  senderId: number;
  recipientId: number;
  content: string;
  createdAt: string;
}

export interface EditorPayload {
  sessionId: string;
  editorContent: string;
}

export interface JoinPayload {
  sessionId: string;
  username: string;
}

export interface MessagePayload {
  sessionId: string;
  user: string;
  message: string;
}

export interface ConnectedUser {
  userId: number;
  username: string;
}
