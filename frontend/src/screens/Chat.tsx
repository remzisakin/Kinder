import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useRoute } from '@react-navigation/native';
import type { MainTabParamList } from '../types/navigation';
import { Header } from '@components/Header';
import { Button } from '@components/Button';
import { ChatBubble } from '@components/ChatBubble';
import { colors, radius, spacing } from '@theme/index';
import { askAssistant, fetchMessages, sendMessage } from '@api/index';
import { useAppStore } from '@store/useAppStore';
import { connectSocket, getSocket } from '@api/socket';
import type { Message } from '@types/index';

export type ChatScreenProps = BottomTabScreenProps<MainTabParamList, 'Chat'>;

type AssistantMessage = {
  id: string;
  from: 'user' | 'assistant';
  text: string;
};

export const ChatScreen: React.FC<ChatScreenProps> = () => {
  const route = useRoute();
  const params = route.params as MainTabParamList['Chat'];
  const currentUser = useAppStore((state) => state.currentUser);
  const matches = useAppStore((state) => state.matches);
  const messagesMap = useAppStore((state) => state.messages);
  const setMessages = useAppStore((state) => state.setMessages);
  const addMessage = useAppStore((state) => state.addMessage);

  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(params?.matchId ?? null);
  const [messageText, setMessageText] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'assistant'>('messages');
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>([]);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantLoading, setAssistantLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      connectSocket(currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    if (params?.matchId) {
      setSelectedMatchId(params.matchId);
    }
  }, [params?.matchId]);

  useEffect(() => {
    if (!selectedMatchId && matches.length > 0) {
      setSelectedMatchId(matches[0].id);
    }
  }, [matches, selectedMatchId]);

  useEffect(() => {
    if (!selectedMatchId || !currentUser) return;

    const loadMessages = async () => {
      setLoadingMessages(true);
      try {
        const data = await fetchMessages(selectedMatchId);
        setMessages(selectedMatchId, data);
      } catch (error) {
        console.error('Mesajlar alınamadı', error);
      } finally {
        setLoadingMessages(false);
      }
    };

    if (!messagesMap[selectedMatchId]) {
      loadMessages();
    }

    const socket = getSocket();
    socket?.emit('joinMatch', selectedMatchId);

    const handler = (incoming: Message) => {
      if (incoming.matchId === selectedMatchId) {
        addMessage(incoming.matchId, incoming);
      }
    };

    socket?.on('message:new', handler);

    return () => {
      socket?.off('message:new', handler);
    };
  }, [addMessage, currentUser, messagesMap, selectedMatchId, setMessages]);

  const messages = useMemo(() => {
    if (!selectedMatchId) return [];
    return messagesMap[selectedMatchId] ?? [];
  }, [messagesMap, selectedMatchId]);

  const selectedMatch = matches.find((item) => item.id === selectedMatchId) ?? null;

  const handleSendMessage = async () => {
    if (!selectedMatchId || !currentUser || !messageText.trim()) return;

    const optimistic: Message = {
      id: Date.now(),
      matchId: selectedMatchId,
      senderId: currentUser.id,
      text: messageText.trim(),
      createdAt: new Date().toISOString(),
    };

    addMessage(selectedMatchId, optimistic);
    setMessageText('');

    try {
      await sendMessage({ matchId: selectedMatchId, senderId: currentUser.id, text: optimistic.text });
    } catch (error) {
      console.error('Mesaj gönderilemedi', error);
    }
  };

  const handleAskAssistant = async () => {
    if (!currentUser || !assistantInput.trim() || assistantLoading) return;

    const prompt = assistantInput.trim();
    setAssistantMessages((prev) => [...prev, { id: `${Date.now()}-user`, from: 'user', text: prompt }]);
    setAssistantInput('');
    setAssistantLoading(true);

    try {
      const response = await askAssistant({ userId: currentUser.id, prompt });
      setAssistantMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-assistant`, from: 'assistant', text: response.answer },
      ]);
    } catch (error) {
      console.error('Asistan hatası', error);
    } finally {
      setAssistantLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="Sohbetler"
        subtitle={selectedMatch ? `${selectedMatch.otherUser.name} ile konuş` : 'Eşleşmelerden birini seç'}
      />
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'messages' && styles.tabActive]}
          onPress={() => setActiveTab('messages')}
        >
          <Text style={[styles.tabLabel, activeTab === 'messages' && styles.tabLabelActive]}>Mesajlar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'assistant' && styles.tabActive]}
          onPress={() => setActiveTab('assistant')}
        >
          <Text style={[styles.tabLabel, activeTab === 'assistant' && styles.tabLabelActive]}>Bilgi/Asistan</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'messages' ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.select({ ios: 'padding', android: undefined })}
          keyboardVerticalOffset={80}
        >
          <View style={styles.matchSelector}>
            <FlatList
              horizontal
              data={matches}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.selectorList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.selectorItem,
                    selectedMatchId === item.id && styles.selectorItemActive,
                  ]}
                  onPress={() => setSelectedMatchId(item.id)}
                >
                  <Text
                    style={[
                      styles.selectorLabel,
                      selectedMatchId === item.id && styles.selectorLabelActive,
                    ]}
                  >
                    {item.otherUser.name}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <Text style={styles.emptyMatch}>Henüz eşleşmen yok.</Text>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <View style={styles.messagesArea}>
            {loadingMessages && messages.length === 0 ? (
              <ActivityIndicator color={colors.khaki700} />
            ) : (
              <FlatList
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.messagesList}
                renderItem={({ item }) => (
                  <ChatBubble text={item.text} isOwn={item.senderId === currentUser?.id} />
                )}
              />
            )}
          </View>

          <View style={styles.inputRow}>
            <TextInput
              placeholder="Mesaj yaz"
              value={messageText}
              onChangeText={setMessageText}
              style={styles.input}
            />
            <Button label="Gönder" onPress={handleSendMessage} style={styles.sendButton} />
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.assistantContainer}>
          <FlatList
            data={assistantMessages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            renderItem={({ item }) => (
              <ChatBubble text={item.text} isOwn={item.from === 'user'} />
            )}
            ListEmptyComponent={() => (
              <Text style={styles.emptyMatch}>
                Asistana soru sorarak güvenli buluşma önerileri al.
              </Text>
            )}
          />
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Sorunu yaz"
              value={assistantInput}
              onChangeText={setAssistantInput}
              style={styles.input}
            />
            <Button
              label={assistantLoading ? 'Bekle…' : 'Sor'}
              onPress={handleAskAssistant}
              style={styles.sendButton}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.khaki50,
  },
  flex: {
    flex: 1,
  },
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    backgroundColor: colors.khaki50,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.khaki300,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.khaki300,
  },
  tabLabel: {
    color: colors.brown600,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: colors.brown800,
  },
  matchSelector: {
    paddingVertical: spacing.md,
  },
  selectorList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  selectorItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.khaki50,
    borderWidth: 1,
    borderColor: colors.khaki300,
    marginRight: spacing.sm,
  },
  selectorItemActive: {
    backgroundColor: colors.khaki700,
    borderColor: colors.khaki700,
  },
  selectorLabel: {
    color: colors.brown600,
    fontWeight: '500',
  },
  selectorLabelActive: {
    color: colors.white,
  },
  emptyMatch: {
    color: colors.gray500,
    paddingHorizontal: spacing.lg,
  },
  messagesArea: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  messagesList: {
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.khaki300,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 44,
    backgroundColor: colors.white,
  },
  sendButton: {
    minWidth: 96,
  },
  assistantContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
});
