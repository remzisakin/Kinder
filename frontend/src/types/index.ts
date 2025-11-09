export type User = {
  id: number;
  name: string;
  age: number;
  gender: string;
  bio: string;
  interests: string[];
  photos: string[];
};

export type FeedResponse = {
  users: User[];
  nextCursor: number | null;
};

export type MatchSummary = {
  id: number;
  createdAt: string;
  otherUser: Pick<User, 'id' | 'name' | 'photos'>;
};

export type Message = {
  id: number;
  matchId: number;
  senderId: number;
  text: string;
  createdAt: string;
};

export type AssistantResponse = {
  answer: string;
  provider: string;
};

export type LikeResponse = {
  like: unknown;
  matched: boolean;
  matchId?: number;
};

export type AuthPayload = {
  userId: number;
};
