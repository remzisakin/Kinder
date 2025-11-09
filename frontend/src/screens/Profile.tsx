import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../types/navigation';
import { Header } from '@components/Header';
import { colors, radius, spacing } from '@theme/index';
import { useAppStore } from '@store/useAppStore';

export type ProfileScreenProps = BottomTabScreenProps<MainTabParamList, 'Profile'>;

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const currentUser = useAppStore((state) => state.currentUser);

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Profil" subtitle="Giriş yap" />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Profil bilgilerini görmek için kayıt ol.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Profil" subtitle="Kendini tanıt" />
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={{ uri: `https://i.pravatar.cc/300?u=${currentUser.name}` }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{currentUser.name}</Text>
        <Text style={styles.meta}>{`${currentUser.age} yaş • ${currentUser.gender}`}</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Biyografi</Text>
          <Text style={styles.cardText}>{currentUser.bio}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>İlgi alanları</Text>
          <View style={styles.tagRow}>
            {currentUser.interests.map((interest) => (
              <View key={interest} style={styles.tag}>
                <Text style={styles.tagLabel}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.khaki50,
  },
  container: {
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: radius.full,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.brown800,
  },
  meta: {
    color: colors.gray500,
  },
  card: {
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.brown800,
  },
  cardText: {
    color: colors.brown600,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.khaki300,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  tagLabel: {
    color: colors.brown800,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  emptyText: {
    color: colors.brown600,
    textAlign: 'center',
  },
});
