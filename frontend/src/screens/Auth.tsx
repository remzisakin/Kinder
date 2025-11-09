import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '@components/Button';
import { Header } from '@components/Header';
import { colors, radius, spacing } from '@theme/index';
import { registerUser } from '@api/index';
import { useAppStore } from '@store/useAppStore';
import type { RootStackParamList } from '../types/navigation';

export type AuthScreenProps = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);
  const resetStore = useAppStore((state) => state.reset);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !age || !gender || !bio) {
      Alert.alert('Eksik bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser({
        name,
        age: Number(age),
        gender,
        bio,
        interests: interests.split(',').map((item) => item.trim()).filter(Boolean),
      });

      resetStore();
      setCurrentUser({
        id: response.userId,
        name,
        age: Number(age),
        gender,
        bio,
        interests: interests.split(',').map((item) => item.trim()).filter(Boolean),
      });

      navigation.replace('MainTabs');
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Kayıt sırasında bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Header title="KhakiMatch" subtitle="Yeni bağlantılar keşfet" />
        <View style={styles.form}>
          <Text style={styles.label}>Ad</Text>
          <TextInput
            placeholder="Adın"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <Text style={styles.label}>Yaş</Text>
          <TextInput
            placeholder="Yaşın"
            value={age}
            onChangeText={setAge}
            keyboardType="number-pad"
            style={styles.input}
          />
          <Text style={styles.label}>Cinsiyet</Text>
          <TextInput
            placeholder="Cinsiyet"
            value={gender}
            onChangeText={setGender}
            style={styles.input}
          />
          <Text style={styles.label}>Biyografi</Text>
          <TextInput
            placeholder="Kendini tanıt"
            value={bio}
            onChangeText={setBio}
            multiline
            style={[styles.input, styles.textArea]}
          />
          <Text style={styles.label}>İlgi alanları (virgülle)</Text>
          <TextInput
            placeholder="kahve, doğa, yoga"
            value={interests}
            onChangeText={setInterests}
            style={styles.input}
          />
          <Button
            label={loading ? 'Kaydediliyor…' : 'Başla'}
            onPress={handleRegister}
            style={styles.submit}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.khaki50,
  },
  container: {
    padding: spacing.lg,
  },
  form: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.brown600,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.khaki300,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.white,
    minHeight: 44,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submit: {
    marginTop: spacing.lg,
  },
});
