import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../types/navigation';
import { Header } from '@components/Header';
import { colors, radius, spacing } from '@theme/index';
import { fetchMatches } from '@api/index';
import { useAppStore } from '@store/useAppStore';
import { formatDate } from '@utils/format';

export type MatchesScreenProps = BottomTabScreenProps<MainTabParamList, 'Matches'>;

export const MatchesScreen: React.FC<MatchesScreenProps> = ({ navigation }) => {
  const currentUser = useAppStore((state) => state.currentUser);
  const matches = useAppStore((state) => state.matches);
  const setMatches = useAppStore((state) => state.setMatches);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMatches = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const data = await fetchMatches(currentUser.id);
        setMatches(data);
      } catch (error) {
        console.error('Eşleşmeler alınamadı', error);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [currentUser, setMatches]);

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Eşleşmeler" subtitle="Konuşmak için dokun" />
      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.khaki700} />
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate('Chat', {
                  matchId: item.id,
                  otherUserName: item.otherUser.name,
                })
              }
            >
              <Image
                source={{
                  uri:
                    item.otherUser.photos?.[0] ||
                    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80',
                }}
                style={styles.avatar}
              />
              <View style={styles.meta}>
                <Text style={styles.name}>{item.otherUser.name}</Text>
                <Text style={styles.time}>{formatDate(item.createdAt)}</Text>
              </View>
              <Text style={styles.cta}>Sohbete Başla</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Henüz eşleşmen yok. Keşfet ekranında kaydırmaya başla!</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.khaki50,
  },
  loader: {
    marginTop: spacing.lg,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
  },
  meta: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.brown800,
  },
  time: {
    color: colors.gray500,
  },
  cta: {
    fontWeight: '600',
    color: colors.khaki700,
  },
  empty: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.brown600,
    textAlign: 'center',
  },
});
