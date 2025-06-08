import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/profile.png')} // use your profile avatar here
          style={styles.avatar}
        />
        <Text style={styles.name}>Hasbullah Rodrigo</Text>
        <Text style={styles.title}>Kitchen Manager</Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconBox}>
            <Ionicons name="mail" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBox}>
            <Ionicons name="call" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBox}>
            <FontAwesome name="whatsapp" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBox}>
            <Ionicons name="star" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Details */}
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <MaterialIcons name="email" size={20} color="#bbb" />
          <View style={styles.infoText}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>LittleBullah@hotmail.com</Text>
          </View>
        </View>

        <View style={styles.row}>
          <MaterialIcons name="phone" size={20} color="#bbb" />
          <View style={styles.infoText}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>(865) 555-0104</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Ionicons name="people" size={20} color="#bbb" />
          <View style={styles.infoText}>
            <Text style={styles.label}>Team</Text>
            <Text style={styles.value}>Hells Kitchen</Text>
          </View>
        </View>

        <View style={styles.row}>
          <MaterialIcons name="supervisor-account" size={20} color="#bbb" />
          <View style={styles.infoText}>
            <Text style={styles.label}>Leads by</Text>
            <Text style={styles.value}>Gordon Ramsey</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.bottomButton}>
            <Ionicons name="person-add" size={18} color="#6200ee" />
            <Text style={styles.bottomText}>Add to contact</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton}>
            <Ionicons name="share-social" size={18} color="#6200ee" />
            <Text style={styles.bottomText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
  },
  header: {
    backgroundColor: '#6200ee',
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
  title: {
    color: '#ddd',
    fontSize: 14,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  iconBox: {
    backgroundColor: '#7a4fff',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  infoContainer: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  infoText: {
    marginLeft: 12,
  },
  label: {
    color: '#888',
    fontSize: 13,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  bottomText: {
    color: '#6200ee',
    fontWeight: '600',
  },
});
