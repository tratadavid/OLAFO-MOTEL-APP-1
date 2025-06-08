import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  const logoGlow = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoGlow, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(logoGlow, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const handleLogin = () => {
    Animated.parallel([
      Animated.timing(cardTranslateY, {
        toValue: 100,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onLogin();
    });
  };

  const glowStyle = {
    shadowColor: '#FF4DB8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: logoGlow,
    shadowRadius: 15,
    elevation: logoGlow.interpolate({
      inputRange: [0, 1],
      outputRange: [2, 12],
    }),
  };
  const handleForgotPassword = () => {
  alert('Please contact your manager or admin to reset your password.');
};


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
          {/* Lottie background */}
          <LottieView
            source={require('../assets/lottie/background.json')}
            autoPlay
            loop
            resizeMode="cover"
            style={StyleSheet.absoluteFill}
          />

          {/* Logo with glow */}
          <Animated.View style={[styles.logoWrapper, glowStyle]}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Form */}
          <Animated.View
            style={[
              styles.formBlock,
              { transform: [{ translateY: cardTranslateY }] },
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#aaa"
              value={username}
              onChangeText={setUsername}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Password"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureEntry}
              />
              <TouchableOpacity
                onPress={() => setSecureEntry(!secureEntry)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={secureEntry ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="#aaa"
                />
              </TouchableOpacity>
            </View>

            {/* Remember Me */}
            <View style={styles.rememberMeContainer}>
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                style={styles.checkbox}
              >
                <Ionicons
                  name={rememberMe ? 'checkbox' : 'square-outline'}
                  size={24}
                  color="#FF4DB8"
                />
              </TouchableOpacity>
              <Text style={styles.rememberMeText}>Remember Me</Text>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotPassword}>
  <Text style={styles.forgotPassword}>Forgot Password?</Text>
</TouchableOpacity>


            
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logoWrapper: {
    marginTop: 90,
    width: 180,
    height: 180,
    backgroundColor: '#1f1f1f',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#FF4DB8',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logo: {
    width: 120,
    height: 120,
  },
  formBlock: {
    width: '85%',
    backgroundColor: '#121212',
    padding: 20,
    borderRadius: 20,
    marginTop: 50,
    elevation: 12,
  },
  input: {
    backgroundColor: '#1f1f1f',
    color: '#fff',
    borderRadius: 15,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  rememberMeText: {
    color: '#ccc',
  },
  loginButton: {
    backgroundColor: '#FF4DB8',
    padding: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#FF4DB8',
    textAlign: 'center',
    marginVertical: 10,
  },
  registerText: {
    textAlign: 'center',
    color: '#ccc',
    marginTop: 10,
  },
  registerLink: {
    color: '#FF4DB8',
    fontWeight: 'bold',
  },
});
