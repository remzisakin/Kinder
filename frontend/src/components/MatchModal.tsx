import React, { useEffect } from 'react';
import { Modal, StyleSheet, Text, View, Vibration } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors, radius, spacing } from '@theme/index';
import { Button } from './Button';
import type { MatchSummary } from '@types/index';

const LOTTIE_URL = 'https://assets10.lottiefiles.com/packages/lf20_cg3nqg.json';

type Props = {
  visible: boolean;
  match?: MatchSummary;
  onClose: () => void;
  onStartChat: (match: MatchSummary) => void;
};

export const MatchModal: React.FC<Props> = ({ visible, match, onClose, onStartChat }) => {
  useEffect(() => {
    if (visible) {
      Vibration.vibrate(300);
    }
  }, [visible]);

  if (!match) {
    return null;
  }

  return (
    <Modal animationType="slide" visible={visible} transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <LottieView
            source={{ uri: LOTTIE_URL }}
            autoPlay
            loop
            style={styles.lottie}
          />
          <Text style={styles.title}>Eşleşme!</Text>
          <Text style={styles.subtitle}>{`${match.otherUser.name} ile bağlandınız.`}</Text>
          <Button label="Sohbete Başla" onPress={() => onStartChat(match)} style={styles.button} />
          <Button label="Pas geç" variant="secondary" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    width: '100%',
    gap: spacing.md,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.brown800,
  },
  subtitle: {
    color: colors.gray500,
    textAlign: 'center',
  },
  button: {
    alignSelf: 'stretch',
  },
});
