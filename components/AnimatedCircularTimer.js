// components/AnimatedCircularTimer.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function AnimatedCircularTimer({ time = '02:45', progress = 0.65, radius = 50, strokeWidth = 6 }) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const size = radius * 2;
  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{ width: size + strokeWidth * 2, height: size + strokeWidth * 2 }}>
      <Svg width={size + strokeWidth * 2} height={size + strokeWidth * 2}>
        <Circle
          stroke="#333"
          cx={halfCircle}
          cy={halfCircle}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          stroke="#00ffb3"
          cx={halfCircle}
          cy={halfCircle}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference}, ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      <View style={styles.labelContainer}>
        <Text style={styles.timeText}>{time}</Text>
        <Text style={styles.label}>Timer</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelContainer: {
    position: 'absolute',
    top: '32%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  label: {
    fontSize: 12,
    color: '#aaa',
  },
});
