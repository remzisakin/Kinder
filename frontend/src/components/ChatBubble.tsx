import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@theme/index';

export type ChatBubbleProps = {
  text: string;
  isOwn?: boolean;
  timestamp?: string;
};

export const ChatBubble: React.FC<ChatBubbleProps> = ({ text, isOwn = false }) => (
  <View style={[styles.container, isOwn ? styles.own : styles.other]}>
    <Text style={[styles.text, isOwn && styles.ownText]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    maxWidth: '80%',
    marginBottom: spacing.sm,
  },
  own: {
    backgroundColor: colors.khaki700,
    alignSelf: 'flex-end',
  },
  other: {
    backgroundColor: colors.khaki50,
    alignSelf: 'flex-start',
  },
  text: {
    color: colors.brown800,
    fontSize: 16,
  },
  ownText: {
    color: colors.white,
  },
});
