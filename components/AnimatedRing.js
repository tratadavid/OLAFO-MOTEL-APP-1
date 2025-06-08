// components/AnimatedRing.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function AnimatedRing({ size = 140, strokeWidth = 12, progress = 0.7 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProgress = useSharedValue(0);

  React.useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 1000 });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference * (1 - animatedProgress.value),
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          stroke="#2f2f2f"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          stroke="#00D97E"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={styles.progressText}>{`${Math.round(progress * 100)}%`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressText: {
    position: 'absolute',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
  },
});
