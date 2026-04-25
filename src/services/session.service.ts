import { Session, User, Message } from "../types/interface";

const sessions: Record<string, Session> = {};

const createSession = (sessionId: string): Session => {
  const session: Session = {
    id: sessionId,
    users: [],
    messages: [],
    editorContent: "",
  };

  sessions[sessionId] = session;
  return session;
};

const getSession = (sessionId: string): Session | undefined => sessions[sessionId];

const addUser = (sessionId: string, user: User): Session | undefined => {
  const session = getSession(sessionId);
  if (!session) {
    return undefined;
  }

  if (session.users.some((existing) => existing.username === user.username)) {
    return undefined;
  }

  session.users.push(user);
  return session;
};

const removeUser = (sessionId: string, socketId: string): Session | undefined => {
  const session = getSession(sessionId);
  if (!session) {
    return undefined;
  }

  session.users = session.users.filter((user) => user.socketId !== socketId);
  return session;
};

const addMessage = (sessionId: string, message: Message): Session | undefined => {
  const session = getSession(sessionId);
  if (!session) {
    return undefined;
  }

  session.messages.push(message);
  return session;
};

const updateEditor = (sessionId: string, editorContent: string): Session | undefined => {
  const session = getSession(sessionId);
  if (!session) {
    return undefined;
  }

  session.editorContent = editorContent;
  return session;
};

const getSessionBySocket = (socketId: string): Session | undefined => {
  return Object.values(sessions).find((session) =>
    session.users.some((user) => user.socketId === socketId)
  );
};

export const sessionService = {
  createSession,
  getSession,
  addUser,
  removeUser,
  addMessage,
  updateEditor,
  getSessionBySocket,
};
