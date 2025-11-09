import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { AuthScreen } from '@screens/Auth';
import { DiscoverScreen } from '@screens/Discover';
import { MatchesScreen } from '@screens/Matches';
import { ChatScreen } from '@screens/Chat';
import { ProfileScreen } from '@screens/Profile';
import { SettingsScreen } from '@screens/Settings';
import { useAppStore } from '@store/useAppStore';
import { colors } from '@theme/index';
import { connectSocket, disconnectSocket, getSocket } from '@api/socket';
import type { MainTabParamList, RootStackParamList } from '@types/navigation';
import type { MatchSummary } from '@types/index';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const navigationRef = createNavigationContainerRef<RootStackParamList>();

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.khaki50,
  },
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.khaki700,
      tabBarInactiveTintColor: colors.brown600,
      tabBarStyle: { backgroundColor: colors.khaki50 },
      tabBarIcon: ({ color, size }) => {
        const map: Record<string, keyof typeof Ionicons.glyphMap> = {
          Discover: 'compass-outline',
          Matches: 'heart-outline',
          Chat: 'chatbubble-ellipses-outline',
          Profile: 'person-outline',
          Settings: 'settings-outline',
        };
        const iconName = map[route.name] ?? 'ellipse-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Discover" component={DiscoverScreen} options={{ title: 'Keşfet' }} />
    <Tab.Screen name="Matches" component={MatchesScreen} options={{ title: 'Eşleşmeler' }} />
    <Tab.Screen name="Chat" component={ChatScreen} options={{ title: 'Sohbetler' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
    <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ayarlar' }} />
  </Tab.Navigator>
);

const App = () => {
  const currentUser = useAppStore((state) => state.currentUser);
  const upsertMatch = useAppStore((state) => state.upsertMatch);
  const showMatchModal = useAppStore((state) => state.showMatchModal);
  const matchModal = useAppStore((state) => state.matchModal);

  useEffect(() => {
    if (!currentUser) {
      disconnectSocket();
      if (navigationRef.isReady()) {
        navigationRef.navigate('Auth');
      }
      return;
    }

    const socket = connectSocket(currentUser.id);

    const onMatchCreated = (payload: { matchId: number; otherUser: { id: number; name: string; photos: string[] } }) => {
      const match: MatchSummary = {
        id: payload.matchId,
        createdAt: new Date().toISOString(),
        otherUser: payload.otherUser,
      };
      upsertMatch(match);
      if (matchModal.match?.id !== match.id || !matchModal.visible) {
        showMatchModal(match);
      }
    };

    socket.on('match:created', onMatchCreated);

    return () => {
      socket.off('match:created', onMatchCreated);
    };
  }, [currentUser, matchModal.match?.id, matchModal.visible, showMatchModal, upsertMatch]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const socket = getSocket();
    return () => {
      socket?.removeAllListeners('message:new');
    };
  }, [currentUser]);

  return (
    <NavigationContainer theme={AppTheme} ref={navigationRef}>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Auth">
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
