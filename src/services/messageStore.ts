import { StoredMessage } from "../types/interface";

const messageStore: StoredMessage[] = [];

export const addDirectMessage = (message: StoredMessage) => {
  messageStore.push(message);
};

export const getDirectMessagesBetween = (userA: number, userB: number) => {
  return messageStore
    .filter((msg) =>
      (msg.senderId === userA && msg.recipientId === userB) ||
      (msg.senderId === userB && msg.recipientId === userA)
    )
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};
