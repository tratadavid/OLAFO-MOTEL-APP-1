import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const allMessages = [
  {
    id: '1',
    name: 'Sonia Lockman',
    preview: 'Hola, ¿viste el cuarto 12?',
    time: '13:40',
    unread: true,
    online: true,
    avatar: require('../assets/avatar1.png'),
  },
  {
    id: '2',
    name: 'Diana Reichert',
    preview: 'Ya terminé la limpieza.',
    time: '12:02',
    unread: false,
    online: false,
    avatar: require('../assets/avatar2.png'),
  },
  {
    id: '3',
    name: 'Enrique Ebert',
    preview: 'Tenemos un check-in a las 2pm.',
    time: '08:26',
    unread: true,
    online: false,
    avatar: require('../assets/avatar3.png'),
  },
];

const registeredWorkers = [
  {
    id: 'w1',
    name: 'Camila Ríos',
    avatar: require('../assets/avatar1.png'),
    online: true,
  },
  {
    id: 'w2',
    name: 'Luis Fernández',
    avatar: require('../assets/avatar2.png'),
    online: false,
  },
  {
    id: 'w3',
    name: 'María Gómez',
    avatar: require('../assets/avatar3.png'),
    online: true,
  },
];

export default function MessagesScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [messages, setMessages] = useState(allMessages);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSearch = (text) => {
    setSearch(text);
    if (text.trim() === '') {
      setMessages(allMessages);
    } else {
      const filtered = allMessages.filter((msg) =>
        msg.name.toLowerCase().includes(text.toLowerCase())
      );
      setMessages(filtered);
    }
  };

  const openNewChat = (worker) => {
    setModalVisible(false);
    navigation.navigate('Chat', {
      name: worker.name,
      avatar: worker.avatar,
    });
  };

  const renderRightActions = () => (
    <View style={styles.rightAction}>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="archive-outline" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="trash-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Messages</Text>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="create-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor="#888"
        value={search}
        onChangeText={handleSearch}
      />

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={renderRightActions}>
            <TouchableOpacity
              style={styles.messageCard}
              onPress={() =>
                navigation.navigate('Chat', {
                  name: item.name,
                  avatar: item.avatar,
                })
              }
            >
              <View style={styles.avatarWrapper}>
                <Image source={item.avatar} style={styles.avatar} />
                <View
                  style={[
                    styles.presenceDot,
                    { backgroundColor: item.online ? '#4CAF50' : '#666' },
                  ]}
                />
              </View>

              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <Text
                    style={[styles.name, item.unread && styles.unreadName]}
                  >
                    {item.name}
                  </Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.preview,
                    item.unread && styles.unreadPreview,
                  ]}
                >
                  {item.preview}
                </Text>
              </View>
            </TouchableOpacity>
          </Swipeable>
        )}
      />

      {/* Modal for new chat */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Start New Chat</Text>
            {registeredWorkers.map((worker) => (
              <TouchableOpacity
                key={worker.id}
                style={styles.workerRow}
                onPress={() => openNewChat(worker)}
              >
                <Image source={worker.avatar} style={styles.workerAvatar} />
                <Text style={styles.workerName}>{worker.name}</Text>
                <View
                  style={[
                    styles.presenceDot,
                    {
                      backgroundColor: worker.online ? '#4CAF50' : '#666',
                      marginLeft: 'auto',
                      marginRight: 5,
                    },
                  ]}
                />
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeModal}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  header: {
    fontSize: 26,
    color: '#fff',
    fontWeight: '700',
  },
  newButton: {
    backgroundColor: '#1e1e1e',
    padding: 8,
    borderRadius: 10,
  },
  searchInput: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 10,
    color: '#fff',
    marginBottom: 20,
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
    backgroundColor: '#121212',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  presenceDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 1,
    borderColor: '#121212',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    color: '#ccc',
    fontWeight: '500',
  },
  unreadName: {
    color: '#fff',
    fontWeight: '700',
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  preview: {
    fontSize: 14,
    color: '#aaa',
  },
  unreadPreview: {
    color: '#fff',
    fontWeight: '600',
  },
  rightAction: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    paddingHorizontal: 10,
  },
  actionButton: {
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalBox: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  workerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  workerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  workerName: {
    color: '#fff',
    fontSize: 16,
  },
  closeModal: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 8,
  },
});
