import { apiClient } from './client';
import type {
  AssistantResponse,
  AuthPayload,
  FeedResponse,
  LikeResponse,
  MatchSummary,
  Message,
  User,
} from '@types/index';

export const registerUser = async (payload: Partial<User>) => {
  const { data } = await apiClient.post<AuthPayload>('/auth/register', payload);
  return data;
};

export const fetchFeed = async (params: {
  userId: number;
  cursor?: number | null;
  limit?: number;
}) => {
  const { data } = await apiClient.get<FeedResponse>('/users/feed', { params });
  return data;
};

export const sendLike = async (payload: { fromUserId: number; toUserId: number }) => {
  const { data } = await apiClient.post<LikeResponse>('/likes', payload);
  return data;
};

export const fetchMatches = async (userId: number) => {
  const { data } = await apiClient.get<{ matches: MatchSummary[] }>('/matches', {
    params: { userId },
  });
  return data.matches;
};

export const fetchMessages = async (matchId: number) => {
  const { data } = await apiClient.get<{ messages: Message[] }>(`/messages/${matchId}`);
  return data.messages;
};

export const sendMessage = async (payload: { matchId: number; senderId: number; text: string }) => {
  const { data } = await apiClient.post<{ message: Message }>('/messages', payload);
  return data.message;
};

export const askAssistant = async (payload: { userId: number; prompt: string }) => {
  const { data } = await apiClient.post<AssistantResponse>('/assistant/ask', payload);
  return data;
};
