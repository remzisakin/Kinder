import { create } from 'zustand';
import type { MatchSummary, Message, User } from '@types/index';

type CurrentUser = {
  id: number;
  name: string;
  age: number;
  gender: string;
  bio: string;
  interests: string[];
};

type MatchModalState = {
  visible: boolean;
  match?: MatchSummary;
};

type AppState = {
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
  feed: User[];
  nextCursor: number | null;
  setFeed: (users: User[], cursor: number | null) => void;
  appendFeed: (users: User[], cursor: number | null) => void;
  removeTopCard: () => void;
  matches: MatchSummary[];
  setMatches: (matches: MatchSummary[]) => void;
  upsertMatch: (match: MatchSummary) => void;
  messages: Record<number, Message[]>;
  setMessages: (matchId: number, messages: Message[]) => void;
  addMessage: (matchId: number, message: Message) => void;
  matchModal: MatchModalState;
  showMatchModal: (match: MatchSummary) => void;
  hideMatchModal: () => void;
  reset: () => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  feed: [],
  nextCursor: null,
  setFeed: (users, cursor) => set({ feed: users, nextCursor: cursor }),
  appendFeed: (users, cursor) =>
    set((state) => ({ feed: [...state.feed, ...users], nextCursor: cursor })),
  removeTopCard: () => {
    const { feed } = get();
    set({ feed: feed.slice(1) });
  },
  matches: [],
  setMatches: (matches) => set({ matches }),
  upsertMatch: (match) => {
    const { matches } = get();
    const existing = matches.findIndex((m) => m.id === match.id);
    if (existing > -1) {
      const updated = [...matches];
      updated[existing] = match;
      set({ matches: updated });
    } else {
      set({ matches: [match, ...matches] });
    }
  },
  messages: {},
  setMessages: (matchId, messages) => {
    set((state) => ({ messages: { ...state.messages, [matchId]: messages } }));
  },
  addMessage: (matchId, message) => {
    const { messages } = get();
    const existing = messages[matchId] ?? [];
    set({ messages: { ...messages, [matchId]: [...existing, message] } });
  },
  matchModal: { visible: false },
  showMatchModal: (match) => set({ matchModal: { visible: true, match } }),
  hideMatchModal: () => set({ matchModal: { visible: false, match: undefined } }),
  reset: () =>
    set({
      currentUser: null,
      feed: [],
      nextCursor: null,
      matches: [],
      messages: {},
      matchModal: { visible: false },
    }),
}));
