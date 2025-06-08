// SplashScreen.js
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions } from 'react-native';

const SplashScreen = ({ onFinish }) => {
  const logoOpacity = new Animated.Value(0);
  const logoTranslate = new Animated.Value(30);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(logoTranslate, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        onFinish();
      }, 700);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/logo.png')} // replace with your refined logo path
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{ translateY: logoTranslate }],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: Dimensions.get('window').width * 0.6,
    height: Dimensions.get('window').width * 0.6,
  },
});

export default SplashScreen;
