import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, spacing } from '@theme/index';

type Props = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  style?: ViewStyle;
};

export const Header: React.FC<Props> = ({ title, subtitle, right, style }) => (
  <View style={[styles.container, style]}>
    <View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
    {right ? <View>{right}</View> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    color: colors.brown800,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.gray500,
    marginTop: 4,
  },
});
