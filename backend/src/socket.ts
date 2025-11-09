import type { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';

interface MatchPayload {
  matchId: number;
  otherUser: {
    id: number;
    name: string;
    photos: string[];
  };
}

interface MessagePayload {
  id: number;
  matchId: number;
  senderId: number;
  text: string;
  createdAt: string;
}

let io: Server | null = null;

export const initSocket = (server: HTTPServer): Server => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
    },
  });

  io.of('/realtime').on('connection', (socket) => {
    const { userId } = socket.handshake.query;
    if (typeof userId === 'string') {
      socket.join(`user:${userId}`);
    }

    socket.on('joinMatch', (matchId: number) => {
      socket.join(`match:${matchId}`);
    });
  });

  return io;
};

const emitToUser = (userId: number, event: string, payload: unknown) => {
  if (!io) return;
  io.of('/realtime').to(`user:${userId}`).emit(event, payload);
};

const emitToMatch = (matchId: number, event: string, payload: unknown) => {
  if (!io) return;
  io.of('/realtime').to(`match:${matchId}`).emit(event, payload);
};

export const notifyMatchCreated = (userIds: number[], payload: MatchPayload) => {
  userIds.forEach((id) => emitToUser(id, 'match:created', payload));
};

export const notifyMessageCreated = (matchId: number, payload: MessagePayload) => {
  emitToMatch(matchId, 'message:new', payload);
};
