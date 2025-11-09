import React from 'react';
import { Alert, Linking, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../types/navigation';
import { Header } from '@components/Header';
import { Button } from '@components/Button';
import { colors, radius, spacing } from '@theme/index';
import { useAppStore } from '@store/useAppStore';
import { disconnectSocket } from '@api/socket';

export type SettingsScreenProps = BottomTabScreenProps<MainTabParamList, 'Settings'>;

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const currentUser = useAppStore((state) => state.currentUser);
  const resetStore = useAppStore((state) => state.reset);

  const handleLogout = () => {
    Alert.alert('Çıkış yap', 'Hesabından çıkmak istediğine emin misin?', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Çıkış yap',
        style: 'destructive',
        onPress: () => {
          resetStore();
          disconnectSocket();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Ayarlar" subtitle="Tercihlerini düzenle" />
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hesap</Text>
          <Text style={styles.cardText}>
            {currentUser
              ? `${currentUser.name} (${currentUser.age})`
              : 'Henüz giriş yapılmadı.'}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Destek</Text>
          <Text style={styles.cardText}>Soruların için destek ekibimizle iletişime geç.</Text>
          <Button
            label="E-posta gönder"
            variant="secondary"
            onPress={() => Linking.openURL('mailto:destek@khakimatch.app')}
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gizlilik</Text>
          <Text style={styles.cardText}>
            KhakiMatch güvenli buluşma kültürünü destekler. Kişisel bilgilerini paylaşmadan önce
            düşün.
          </Text>
        </View>
        <Button label="Çıkış yap" onPress={handleLogout} />
      </View>
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
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.lg,
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
});
