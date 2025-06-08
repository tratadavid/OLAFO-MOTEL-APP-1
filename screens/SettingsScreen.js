import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../ThemeContext';

export default function SettingsScreen({ navigation }) {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [modalVisible, setModalVisible] = useState(false);

  const styles = getStyles(isDarkMode);

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image source={require('../assets/logo.png')} style={styles.avatar} />
        <View>
          <Text style={styles.name}>Olafo Staff</Text>
          <Text style={styles.subtitle}>Staff Member</Text>
        </View>
      </View>

      {/* Other Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other settings</Text>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={20} color={styles.iconColor.color} style={styles.icon} />
          <Text style={styles.settingText}>Profile Details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Password')}>
          <Ionicons name="lock-closed-outline" size={20} color={styles.iconColor.color} style={styles.icon} />
          <Text style={styles.settingText}>Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={20} color={styles.iconColor.color} style={styles.icon} />
          <Text style={styles.settingText}>Notifications</Text>
        </TouchableOpacity>

        <View style={styles.settingItem}>
          <Ionicons name="moon-outline" size={20} color={styles.iconColor.color} style={styles.icon} />
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            thumbColor="#FF4DB8"
          />
        </View>
      </View>

      {/* About + Help Section */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.settingItem} onPress={() => setModalVisible(true)}>
          <Ionicons name="information-circle-outline" size={20} color={styles.iconColor.color} style={styles.icon} />
          <Text style={styles.settingText}>About Application</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Help')}>
          <Ionicons name="help-circle-outline" size={20} color={styles.iconColor.color} style={styles.icon} />
          <Text style={styles.settingText}>Help / FAQ</Text>
        </TouchableOpacity>
      </View>

      {/* About Application Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>About Olafo Motel</Text>
            <Text style={styles.modalText}>
              This app helps manage daily tasks at Olafo Motel efficiently. Version 1.0.0
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const getStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#ffffff',
      paddingHorizontal: 20,
      paddingTop: 30,
    },
    profileSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 30,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 15,
      borderWidth: 2,
      borderColor: '#FF4DB8',
    },
    name: {
      color: isDark ? '#fff' : '#000',
      fontSize: 18,
      fontWeight: 'bold',
    },
    subtitle: {
      color: isDark ? '#aaa' : '#666',
      fontSize: 14,
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      color: isDark ? '#fff' : '#000',
      fontSize: 16,
      marginBottom: 10,
      fontWeight: '600',
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    settingText: {
      color: isDark ? '#ccc' : '#333',
      fontSize: 16,
      flex: 1,
    },
    icon: {
      marginRight: 10,
    },
    iconColor: {
      color: isDark ? '#ccc' : '#444',
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
      width: '80%',
      backgroundColor: isDark ? '#1f1f1f' : '#f0f0f0',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalTitle: {
      color: isDark ? '#fff' : '#000',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalText: {
      color: isDark ? '#ccc' : '#333',
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
    },
    closeButton: {
      color: '#FF4DB8',
      fontSize: 16,
    },
  });
