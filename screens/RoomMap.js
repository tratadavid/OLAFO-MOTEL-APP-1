import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';

const startupTimestamp = Date.now();

const initialRooms = [
  { id: 1, section: 'Occidental', status: 'available', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 2, section: 'Occidental', status: 'occupied', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 3, section: 'Occidental', status: 'cleaning', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 4, section: 'Occidental', status: 'available', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 5, section: 'Occidental', status: 'occupied', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 6, section: 'Occidental', status: 'available', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 7, section: 'Occidental', status: 'cleaning', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 8, section: 'Occidental', status: 'available', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 9, section: 'Occidental', status: 'available', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 10, section: 'Occidental', status: 'available', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 11, section: 'Occidental', status: 'occupied', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 12, section: 'Occidental', status: 'cleaning', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 13, section: 'Occidental', status: 'available', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 14, section: 'Occidental', status: 'occupied', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 15, section: 'Occidental', status: 'available', statusStart: startupTimestamp, lastCleaned: startupTimestamp },

  { id: 16, section: 'Oriental', status: 'available', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 17, section: 'Oriental', status: 'occupied', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 18, section: 'Oriental', status: 'cleaning', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 19, section: 'Oriental', status: 'available', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 20, section: 'Oriental', status: 'occupied', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 21, section: 'Oriental', status: 'cleaning', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 22, section: 'Oriental', status: 'available', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 23, section: 'Oriental', status: 'available', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 24, section: 'Oriental', status: 'occupied', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 25, section: 'Oriental', status: 'available', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 26, section: 'Oriental', status: 'available', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 27, section: 'Oriental', status: 'occupied', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 28, section: 'Oriental', status: 'cleaning', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 29, section: 'Oriental', status: 'available', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 30, section: 'Oriental', status: 'occupied', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 31, section: 'Oriental', status: 'available', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 32, section: 'Oriental', status: 'occupied', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 33, section: 'Oriental', status: 'available', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
  { id: 34, section: 'Oriental', status: 'available', statusStart: startupTimestamp, lastCleaned: startupTimestamp },
];


export default function RoomMap({ selectedFilter }) {
  const [rooms, setRooms] = useState(initialRooms);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [tick, setTick] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTick(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const getColor = (status) => {
    switch (status) {
      case 'available': return '#00D97E';
      case 'occupied': return '#FF4D4D';
      case 'cleaning': return '#FFB700';
      default: return '#888';
    }
  };

  const formatDuration = (start) => {
    const duration = Math.floor((tick - start) / 60000);
    const maxMinutes = 4 * 60;
    const clamped = Math.min(duration, maxMinutes);
    const hours = Math.floor(clamped / 60);
    const minutes = clamped % 60;
    return `${hours}h ${minutes}m`;
  };

  const formatLastCleaned = (timestamp) => {
    const minutesAgo = Math.floor((tick - timestamp) / 60000);
    if (minutesAgo < 1) return 'Just now';
    if (minutesAgo < 60) return `${minutesAgo} min ago`;
    const hours = Math.floor(minutesAgo / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  const updateRoomStatus = (status) => {
    if (selectedRoom) {
      const now = Date.now();
      const updatedRooms = rooms.map((room) => {
        if (room.id === selectedRoom.id) {
          return {
            ...room,
            status,
            statusStart: now,
            lastCleaned: status === 'available' ? now : room.lastCleaned,
          };
        }
        return room;
      });
      const updated = updatedRooms.find((r) => r.id === selectedRoom.id);
      setRooms(updatedRooms);
      setSelectedRoom(updated);
    }
  };

  const filterRooms = (room) => {
    if (selectedFilter === 'All') return true;
    return room.status === selectedFilter.toLowerCase();
  };

  return (
    <View>
      <Text style={styles.roomCounter}>
        {selectedFilter === 'All'
          ? `Showing all ${rooms.length} rooms`
          : `Showing ${rooms.filter(filterRooms).length} ${selectedFilter.toLowerCase()} rooms`}
      </Text>

      {['Occidental', 'Oriental'].map((section) => (
        <View key={section} style={styles.section}>
          <Text style={styles.sectionTitle}>Ala {section}</Text>
          <View style={styles.roomGrid}>
            {rooms
              .filter((r) => r.section === section && filterRooms(r))
              .map((room) => (
                <TouchableOpacity
                  key={room.id}
                  style={[styles.roomBox, { backgroundColor: getColor(room.status) }]}
                  onPress={() => setSelectedRoom(room)}
                >
                  <Text style={styles.roomText}>Room {room.id}</Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      ))}

      {/* Room Details Modal */}
      <Modal
        visible={!!selectedRoom}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedRoom(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ScrollView>
              <Text style={styles.modalTitle}>Room {selectedRoom?.id}</Text>

              <Text style={styles.modalLabel}>Status:</Text>
              <Text style={styles.modalText}>{selectedRoom?.status}</Text>

              <Text style={styles.modalLabel}>Time in status:</Text>
              <Text style={styles.modalText}>{formatDuration(selectedRoom?.statusStart)}</Text>

              <Text style={styles.modalLabel}>Last cleaned:</Text>
              <Text style={styles.modalText}>{formatLastCleaned(selectedRoom?.lastCleaned)}</Text>

              <Text style={styles.modalLabel}>Change Status:</Text>
              <View style={styles.statusBtnRow}>
                <TouchableOpacity
                  onPress={() => updateRoomStatus('available')}
                  style={[styles.statusBtn, { backgroundColor: '#00D97E' }]}
                >
                  <Text style={styles.statusBtnText}>Available</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => updateRoomStatus('occupied')}
                  style={[styles.statusBtn, { backgroundColor: '#FF4D4D' }]}
                >
                  <Text style={styles.statusBtnText}>Occupied</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => updateRoomStatus('cleaning')}
                  style={[styles.statusBtn, { backgroundColor: '#FFB700' }]}
                >
                  <Text style={styles.statusBtnText}>Cleaning</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => setSelectedRoom(null)}
                style={styles.closeBtn}
              >
                <Text style={{ color: '#fff' }}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  roomCounter: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 5,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  roomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  roomBox: {
    width: '30%',
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  roomText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 15,
    maxHeight: '80%',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalLabel: {
    color: '#ccc',
    fontSize: 13,
    marginTop: 10,
  },
  modalText: {
    color: '#fff',
    fontSize: 14,
  },
  statusBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  statusBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusBtnText: {
    color: '#000',
    fontWeight: 'bold',
  },
  closeBtn: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
});
