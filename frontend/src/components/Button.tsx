import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@theme/index';

type Props = {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary';
};

export const Button: React.FC<Props> = ({ label, onPress, style, variant = 'primary' }) => {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.base,
        variant === 'secondary' ? styles.secondary : styles.primary,
        pressed && { opacity: 0.8 },
        style,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.label, variant === 'secondary' && styles.secondaryLabel]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.khaki700,
  },
  secondary: {
    backgroundColor: colors.khaki50,
    borderWidth: 1,
    borderColor: colors.khaki300,
  },
  label: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryLabel: {
    color: colors.brown800,
  },
});
