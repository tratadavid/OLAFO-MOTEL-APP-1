import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, FlatList, TextInput,
  TouchableOpacity, Modal
} from 'react-native';
import RoomMap from './RoomMap';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';



const stats = [
  { id: '1', title: 'Check-ins Today', value: '3', subtitle: 'Expected arrivals' },
  { id: '2', title: 'Available Rooms', value: '12', subtitle: 'Ready for guests' },
  { id: '3', title: 'Occupancy Rate', value: '78%', subtitle: 'This week' },
  { id: '4', title: 'Pending Tasks', value: '5', subtitle: 'To complete' },
  { id: '5', title: 'Upcoming Reservations', value: '4', subtitle: 'Tomorrow' },
  { id: '6', title: 'Rooms Being Cleaned', value: '2', subtitle: 'In progress' },
];

const filters = ['All', 'Cleaning', 'Occupied', 'Available'];

export default function HomeScreen({ navigation }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const [announcements, setAnnouncements] = useState([
    "🔨 Room 12: Air conditioner maintenance",
    "🮚 Staff meeting today at 2 PM",
    "📦 New cleaning supplies arriving tomorrow",
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [editedAnnouncements, setEditedAnnouncements] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const styles = getStyles(isDark); // 👈 replace static styles call


  const handleSaveAnnouncement = () => {
    if (newAnnouncement.trim() !== '') {
      setAnnouncements([newAnnouncement.trim(), ...announcements]);
      setNewAnnouncement('');
      setAddModalVisible(false);
    }
  };

  const handleSaveEditedAnnouncements = () => {
    setAnnouncements(editedAnnouncements);
    setEditModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Row */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search guests, rooms, or tasks"
          placeholderTextColor={isDark ? '#888' : '#999'}

        />
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('QuickStats')}>
          <Ionicons name="stats-chart-outline" size={24} color="#fff" />

        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Widgets')}>
          <Ionicons name="pulse-outline" size={24} color={isDark ? '#fff' : '#222'} />

        </TouchableOpacity>
      </View>


      <Text style={styles.header}>Motel Olafo</Text>
      <Text style={styles.dateText}>{today}</Text>

      {/* Stats */}
      <FlatList
        data={stats}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsScroll}
        renderItem={({ item }) => (
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>{item.title}</Text>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statSubtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      {/* Filters */}
      <FlatList
        data={filters}
        horizontal
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, selectedFilter === item && { backgroundColor: '#00D97E' }]}
            onPress={() => setSelectedFilter(item)}
          >
            <Text style={styles.filterText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Announcements */}
      <View style={styles.announcementBox}>
        <View style={styles.announcementHeader}>
          <Text style={styles.sectionTitle}>Announcements</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setAddModalVisible(true)} style={{ marginRight: 10 }}>
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setEditedAnnouncements([...announcements]);
              setEditModalVisible(true);
            }}>
              <Ionicons name="create-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.announcementCard}>
            {announcements.map((item, index) => (
              <Text key={index} style={styles.announcementText}>{item}</Text>
            ))}
          </View>
        </TouchableOpacity>
      </View>

      {/* Room Map */}
      <View style={{ marginTop: 30 }}>
        <Text style={styles.sectionTitle}>Room Map</Text>
        <RoomMap selectedFilter={selectedFilter} />
      </View>

      {/* Modals */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {announcements.map((item, index) => (
                <Text key={index} style={styles.modalText}>{item}</Text>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalButton}>
              <Text style={{ color: '#fff' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={addModalVisible} transparent animationType="fade" onRequestClose={() => setAddModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Type your announcement..."
              placeholderTextColor="#888"
              value={newAnnouncement}
              onChangeText={setNewAnnouncement}
              multiline
            />
            <TouchableOpacity onPress={handleSaveAnnouncement} style={styles.saveButton}>
              <Text style={{ color: '#fff' }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAddModalVisible(false)} style={styles.closeModalButton}>
              <Text style={{ color: '#fff' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={editModalVisible} transparent animationType="fade" onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {editedAnnouncements.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={item}
                    onChangeText={(text) => {
                      const copy = [...editedAnnouncements];
                      copy[index] = text;
                      setEditedAnnouncements(copy);
                    }}
                    multiline
                  />
                  <TouchableOpacity onPress={() => {
                    const copy = [...editedAnnouncements];
                    copy.splice(index, 1);
                    setEditedAnnouncements(copy);
                  }}>
                    <Ionicons name="trash-outline" size={24} color="#FF4D4D" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={handleSaveEditedAnnouncements} style={styles.saveButton}>
              <Text style={{ color: '#fff' }}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.closeModalButton}>
              <Text style={{ color: '#fff' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const getStyles = (isDark) => StyleSheet.create({

  container: {
    backgroundColor: '#121212',
    paddingVertical: 20,
    paddingHorizontal: 15,
    paddingBottom: 60,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: 10,
    borderRadius: 10,
    color: '#fff',
    marginRight: 10,
  },
  iconButton: {
    padding: 6,
    marginLeft: 5,
  },
  header: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 20,
  },
  statsScroll: {
    paddingBottom: 10,
  },
  statCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 14,
    padding: 15,
    width: 180,
    marginRight: 15,
  },
  statTitle: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 4,
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statSubtitle: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  filterScroll: {
    marginTop: 15,
    paddingBottom: 10,
  },
  filterChip: {
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  filterText: {
    color: '#fff',
    fontSize: 13,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  announcementBox: {
    marginTop: 30,
    marginBottom: 20,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  announcementCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 14,
    padding: 15,
    marginTop: 10,
  },
  announcementText: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 15,
    width: '85%',
    maxHeight: '70%',
  },
  modalText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  closeModalButton: {
    marginTop: 15,
    backgroundColor: '#333',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: '#00D97E',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
});