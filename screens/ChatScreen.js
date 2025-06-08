import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ChatHeader = ({ name, avatar }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Image
      source={avatar}
      style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }}
    />
    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{name}</Text>
  </View>
);

export default function ChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { name, avatar } = route.params;

  const [messages, setMessages] = useState([
    { id: '1', text: '¿Terminaste el cuarto 12?', sender: 'them', time: '13:45' },
    { id: '2', text: 'Sí, ya está limpio.', sender: 'me', time: '13:46', read: true },
    { id: '3', text: 'Perfecto, gracias!', sender: 'them', time: '13:47' },
  ]);

  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#121212' },
      headerTintColor: '#fff',
      headerTitle: () => <ChatHeader name={name} avatar={avatar} />,
    });
  }, [navigation]);

  const handleSend = () => {
    if (!text.trim()) return;

    const now = new Date();
    const newMessage = {
      id: Date.now().toString(),
      text,
      sender: 'me',
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setText('');
    simulateTypingResponse();
  };

  const simulateTypingResponse = () => {
    setIsTyping(true);

    setTimeout(() => {
      const response = {
        id: Date.now().toString() + '_res',
        text: 'Entendido, ¡gracias!',
        sender: 'them',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      // Mark last 'me' message as read
      setMessages((prev) => {
        const updated = [...prev];
        const lastMe = [...updated].reverse().find((m) => m.sender === 'me');
        if (lastMe) lastMe.read = true;
        return [...updated, response];
      });

      setIsTyping(false);
    }, 1800);
  };

  const renderBubble = ({ item, index }) => {
    const isMine = item.sender === 'me';
    const isLastMine =
      isMine &&
      (index === messages.length - 1 ||
        messages.slice(index + 1).find((m) => m.sender === 'me') === undefined);

    return (
      <View
        style={[
          styles.bubble,
          isMine ? styles.myBubble : styles.theirBubble,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <View style={styles.bubbleFooter}>
          <Text style={styles.timestamp}>{item.time}</Text>
          {isLastMine && (
            <Ionicons
              name={item.read ? 'checkmark-done' : 'checkmark'}
              size={16}
              color={item.read ? '#4CAF50' : '#aaa'}
              style={{ marginLeft: 6 }}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
          renderItem={renderBubble}
        />
        {isTyping && (
          <View style={styles.typingIndicator}>
            <ActivityIndicator size="small" color="#888" />
            <Text style={styles.typingText}>{name} is typing...</Text>
          </View>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            value={text}
            onChangeText={setText}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    paddingBottom: 10,
  },
  chatContainer: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  bubble: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 16,
    marginVertical: 6,
  },
  myBubble: {
    backgroundColor: '#3399FF',
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: '#1e1e1e',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
  },
  messageText: {
    color: '#fff',
    fontSize: 15,
  },
  bubbleFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    color: '#bbb',
    fontSize: 11,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#121212',
  },
  input: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#3399FF',
    padding: 10,
    borderRadius: 20,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingBottom: 8,
  },
  typingText: {
    color: '#888',
    marginLeft: 8,
    fontSize: 13,
  },
});
