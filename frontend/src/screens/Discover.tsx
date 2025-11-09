import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Header } from '@components/Header';
import { SwipeCard } from '@components/SwipeCard';
import { Button } from '@components/Button';
import { MatchModal } from '@components/MatchModal';
import { colors, spacing } from '@theme/index';
import { fetchFeed, sendLike } from '@api/index';
import { useAppStore } from '@store/useAppStore';
import type { MatchSummary, User } from '@types/index';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../types/navigation';

export type DiscoverScreenProps = BottomTabScreenProps<MainTabParamList, 'Discover'>;

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ navigation }) => {
  const {
    currentUser,
    feed,
    nextCursor,
    setFeed,
    appendFeed,
    removeTopCard,
    showMatchModal,
    hideMatchModal,
  } = useAppStore(
    (state) => ({
      currentUser: state.currentUser,
      feed: state.feed,
      nextCursor: state.nextCursor,
      setFeed: state.setFeed,
      appendFeed: state.appendFeed,
      removeTopCard: state.removeTopCard,
      showMatchModal: state.showMatchModal,
      hideMatchModal: state.hideMatchModal,
    }),
  );
  const matchModal = useAppStore((state) => state.matchModal);
  const upsertMatch = useAppStore((state) => state.upsertMatch);

  const [loading, setLoading] = useState(false);

  const loadFeed = useCallback(
    async (cursor?: number | null) => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const data = await fetchFeed({ userId: currentUser.id, cursor: cursor ?? undefined });
        if (cursor) {
          appendFeed(data.users, data.nextCursor);
        } else {
          setFeed(data.users, data.nextCursor);
        }
      } catch (error) {
        console.error('Feed alınamadı', error);
      } finally {
        setLoading(false);
      }
    },
    [appendFeed, currentUser, setFeed],
  );

  useEffect(() => {
    if (currentUser && feed.length === 0 && !loading) {
      loadFeed();
    }
  }, [currentUser, feed.length, loadFeed, loading]);

  const handleSwipe = useCallback(
    async (cardIndex: number, direction: 'left' | 'right') => {
      const user = feed[cardIndex];
      if (!user || !currentUser) return;

      if (direction === 'right') {
        try {
          const response = await sendLike({ fromUserId: currentUser.id, toUserId: user.id });
          if (response.matched && response.matchId) {
            const match: MatchSummary = {
              id: response.matchId,
              createdAt: new Date().toISOString(),
              otherUser: {
                id: user.id,
                name: user.name,
                photos: user.photos,
              },
            };
            upsertMatch(match);
          }
        } catch (error) {
          console.error('Beğeni hatası', error);
        }
      }

      removeTopCard();

      const remaining = feed.length - 1;
      if (remaining <= 3 && nextCursor) {
        loadFeed(nextCursor);
      }
    },
    [currentUser, feed.length, loadFeed, nextCursor, removeTopCard, upsertMatch],
  );

  const renderNoMoreCards = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>Şimdilik gösterilecek kişi yok.</Text>
      <Button label="Yenile" onPress={() => loadFeed()} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Keşfet" subtitle="Beğendiğin kartları sağa kaydır" />
      <View style={styles.container}>
        {feed.length > 0 ? (
          <Swiper
            cards={feed}
            renderCard={(user: User) => (user ? <SwipeCard user={user} /> : null)}
            onSwipedLeft={(index) => handleSwipe(index, 'left')}
            onSwipedRight={(index) => handleSwipe(index, 'right')}
            stackSize={3}
            backgroundColor="transparent"
            cardIndex={0}
            disableTopSwipe
            disableBottomSwipe
            overlayLabels={{
              left: {
                title: 'Pas geç',
                style: {
                  label: styles.overlayLabel,
                  wrapper: styles.overlayLeft,
                },
              },
              right: {
                title: 'Beğendin',
                style: {
                  label: styles.overlayLabel,
                  wrapper: styles.overlayRight,
                },
              },
            }}
          />
        ) : loading ? (
          <ActivityIndicator color={colors.khaki700} />
        ) : (
          renderNoMoreCards()
        )}
      </View>
      <MatchModal
        visible={matchModal.visible}
        match={matchModal.match}
        onClose={hideMatchModal}
        onStartChat={(match) => {
          hideMatchModal();
          navigation.navigate('Chat', {
            matchId: match.id,
            otherUserName: match.otherUser.name,
          });
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.khaki50,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    color: colors.brown800,
    textAlign: 'center',
  },
  overlayLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  overlayLeft: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 16,
  },
  overlayRight: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 16,
  },
});
