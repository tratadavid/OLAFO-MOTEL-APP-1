import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PasswordScreen() {
  const [pin, setPin] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const correctPin = '5647';

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      setPin(pin + num);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const verifyPin = () => {
    if (pin === correctPin) {
      setIsVerified(true);
    } else {
      Alert.alert('Invalid Code', 'Please try again.');
      setPin('');
    }
  };

  const handleSavePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    if (currentPassword !== 'currentpass') {
      Alert.alert('Error', 'Current password is incorrect.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    Alert.alert('Success', 'Password updated.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>🔐 Change Password</Text>

      {!isVerified ? (
        <View style={styles.pinSection}>
          <Text style={styles.pinText}>Enter your 4-digit PIN</Text>
          <View style={styles.pinDots}>
            {[0, 1, 2, 3].map((_, i) => (
              <View key={i} style={[styles.dot, pin[i] && styles.filledDot]} />
            ))}
          </View>

          <View style={styles.keypad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '←'].map((key, i) => (
              <TouchableOpacity
                key={i}
                style={styles.key}
                onPress={() =>
                  key === '←'
                    ? handleBackspace()
                    : key === ''
                    ? null
                    : handleKeyPress(String(key))
                }>
                <Text style={styles.keyText}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {pin.length === 4 && (
            <TouchableOpacity style={styles.verifyBtn} onPress={verifyPin}>
              <Text style={styles.verifyText}>Verify</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.formSection}>
          <Text style={styles.inputLabel}>Current Password</Text>
          <TextInput
            placeholder="KenzIsStupid"
            placeholderTextColor="#aaa"
            style={styles.input}
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />

          <Text style={styles.inputLabel}>New Password</Text>
          <TextInput
            placeholder="Enter new password"
            placeholderTextColor="#aaa"
            style={styles.input}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <Text style={styles.inputLabel}>Confirm Password</Text>
          <TextInput
            placeholder="Confirm new password"
            placeholderTextColor="#aaa"
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSavePassword}>
            <Ionicons name="lock-closed" size={18} color="#fff" />
            <Text style={styles.saveText}>Save Password</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
  },
  pinSection: {
    alignItems: 'center',
  },
  pinText: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 20,
  },
  pinDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#888',
    marginHorizontal: 10,
  },
  filledDot: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 240,
    justifyContent: 'center',
  },
  key: {
    width: 60,
    height: 60,
    backgroundColor: '#1f1f1f',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  keyText: {
    color: '#fff',
    fontSize: 22,
  },
  verifyBtn: {
    marginTop: 20,
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  verifyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  formSection: {
    marginTop: 20,
  },
  inputLabel: {
    color: '#bbb',
    fontSize: 14,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  saveBtn: {
    flexDirection: 'row',
    backgroundColor: '#6200ee',
    marginTop: 30,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
