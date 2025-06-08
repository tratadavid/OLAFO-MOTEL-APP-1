import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

export default function NotificationsScreen() {
  const [taskAlerts, setTaskAlerts] = useState(true);
  const [missedTasks, setMissedTasks] = useState(false);
  const [roomUpdates, setRoomUpdates] = useState(true);
  const [messages, setMessages] = useState(false);
  const [appUpdates, setAppUpdates] = useState(true);

  const saveRef = useRef(null);

  const handleSave = () => {
    if (saveRef.current) {
      saveRef.current.pulse(500);
    }
    Alert.alert('Preferences Saved', 'Your notification settings have been updated.');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animatable.View animation="fadeInDown" delay={100} duration={500} style={styles.header}>
        <Image source={require('../assets/profile.png')} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Hasbullah Rodrigo</Text>
          <Text style={styles.userRole}>Kitchen Manager</Text>
        </View>
      </Animatable.View>

      {/* Settings List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Preferences</Text>

        {[
          { label: 'Task Reminders', icon: 'calendar-outline', state: taskAlerts, set: setTaskAlerts },
          { label: 'Missed Tasks', icon: 'alert-circle-outline', state: missedTasks, set: setMissedTasks },
          { label: 'Room Status Updates', icon: 'bed-outline', state: roomUpdates, set: setRoomUpdates },
          { label: 'New Messages', icon: 'chatbox-ellipses-outline', state: messages, set: setMessages },
        ].map((item, index) => (
          <Animatable.View
            key={item.label}
            animation="fadeInUp"
            delay={200 + index * 100}
            duration={400}
            style={styles.row}
          >
            <Ionicons name={item.icon} size={20} color="#bbb" style={styles.icon} />
            <Text style={styles.label}>{item.label}</Text>
            <Switch
              value={item.state}
              onValueChange={item.set}
              thumbColor={item.state ? '#6200ee' : '#888'}
            />
          </Animatable.View>
        ))}

        <Animatable.View animation="fadeInUp" delay={600} duration={400} style={styles.row}>
          <MaterialCommunityIcons name="update" size={20} color="#bbb" style={styles.icon} />
          <Text style={styles.label}>App Updates</Text>
          <Switch
            value={appUpdates}
            onValueChange={setAppUpdates}
            thumbColor={appUpdates ? '#6200ee' : '#888'}
          />
        </Animatable.View>
      </View>

      {/* Save Button with Pulse Animation */}
      <Animatable.View ref={saveRef}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </Animatable.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  userInfo: {
    justifyContent: 'center',
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  userRole: {
    color: '#bbb',
    fontSize: 13,
    marginTop: 2,
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 14,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  saveBtn: {
    marginTop: 20,
    backgroundColor: '#6200ee',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
