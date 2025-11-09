export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  ChatDetail: {
    matchId: number;
    otherUserName: string;
  };
};

export type MainTabParamList = {
  Discover: undefined;
  Matches: undefined;
  Chat: {
    matchId?: number;
    otherUserName?: string;
  } | undefined;
  Profile: undefined;
  Settings: undefined;
};
