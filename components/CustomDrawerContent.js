// CustomDrawerContent.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

export default function CustomDrawerContent(props) {
  const { onLogout } = props;

  return (
    <View style={{ flex: 1, backgroundColor: '#1f1f1f' }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.profileBox}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.profileImage}
          />
          <Text style={styles.username}>Olafo Staff</Text>
        </View>
  
        <View style={styles.menuItems}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
  
      <TouchableOpacity style={styles.logoutBox} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={20} color="#FF4DB8" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1f1f1f',
  },
  profileBox: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#FF4DB8',
    marginBottom: 10,
  },
  username: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuItems: {
    paddingTop: 10,
  },
  logoutBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    marginBottom: 30, // <-- This lifts it up
  },
  
  logoutText: {
    color: '#FF4DB8',
    fontSize: 16,
    marginLeft: 10,
  },
});