import { io, Socket } from 'socket.io-client';
import { API_BASE_URL as ENV_BASE_URL } from '@env';

let socket: Socket | null = null;

export const connectSocket = (userId: number) => {
  if (socket) {
    return socket;
  }

  const url = ENV_BASE_URL ? ENV_BASE_URL : 'http://10.0.2.2:4000';

  socket = io(`${url}/realtime`, {
    transports: ['websocket'],
    query: { userId: String(userId) },
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
