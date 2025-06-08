import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const initialStaff = [
  { id: '1', name: 'Carlos Rivera', role: 'Cleaner', avatar: require('../assets/avatar1.png') },
  { id: '2', name: 'Maria Lopez', role: 'Cook', avatar: require('../assets/avatar2.png') },
  { id: '3', name: 'John Smith', role: 'Guard', avatar: null },
  { id: '4', name: 'Fatima Ali', role: 'Cleaner', avatar: null },
];

const roleColors = {
  Cleaner: '#4CAF50',
  Cook: '#FF9800',
  Guard: '#2196F3',
};

export default function StaffDirectoryScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [staff, setStaff] = useState(initialStaff);

  const filteredStaff = staff.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(search.toLowerCase()) ||
      person.role.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || person.role === filter;
    return matchesSearch && matchesFilter;
  });

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleLongPress = (user) => {
    Alert.alert('Manager Actions', `Assign task to ${user.name}?\n(View profile, etc)`);
  };

  const handleViewProfile = (user) => {
    navigation.navigate('Profile', { user });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleViewProfile(item)}
      onLongPress={() => handleLongPress(item)}
    >
      {item.avatar ? (
        <Image source={item.avatar} style={styles.avatar} />
      ) : (
        <View style={styles.fallbackAvatar}>
          <Text style={styles.initials}>{getInitials(item.name)}</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={[styles.role, { color: roleColors[item.role] || '#ccc' }]}>{item.role}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity>
          <Ionicons name="chatbox-ellipses-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 16 }}>
          <Ionicons name="call-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👥 Staff Directory</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or role..."
        placeholderTextColor="#aaa"
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filterContainer}>
        {['All', 'Cleaner', 'Cook', 'Guard'].map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.filterBtn, filter === r && styles.filterBtnActive]}
            onPress={() => setFilter(r)}
          >
            <Text style={styles.filterText}>{r}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredStaff}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
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
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    marginBottom: 12,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 10,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
  },
  filterBtnActive: {
    backgroundColor: '#6200ee',
  },
  filterText: {
    color: '#fff',
    fontSize: 13,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 14,
  },
  fallbackAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  initials: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  role: {
    fontSize: 13,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
