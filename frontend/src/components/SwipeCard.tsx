import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { User } from '@types/index';
import { colors, radius, spacing } from '@theme/index';

const fallbackPhoto = 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80';

type Props = {
  user: User;
};

export const SwipeCard: React.FC<Props> = ({ user }) => {
  const photo = user.photos?.[0] ?? fallbackPhoto;

  return (
    <View style={styles.card}>
      <Image source={{ uri: photo }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{`${user.name}, ${user.age}`}</Text>
        <Text style={styles.bio}>{user.bio}</Text>
        <View style={styles.interestRow}>
          {user.interests?.map((interest) => (
            <View key={interest} style={styles.pill}>
              <Text style={styles.pillText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    flex: 1,
  },
  image: {
    width: '100%',
    height: 360,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  name: {
    fontSize: 24,
    color: colors.brown800,
    fontWeight: '700',
  },
  bio: {
    color: colors.gray500,
  },
  interestRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  pill: {
    backgroundColor: colors.khaki50,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  pillText: {
    color: colors.brown600,
    fontSize: 12,
  },
});
