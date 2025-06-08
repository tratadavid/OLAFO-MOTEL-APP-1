// WidgetCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';

export default function WidgetCard({ title, value, progress, color }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {progress !== undefined && (
        <Progress.Bar
          progress={progress}
          width={null}
          color={color}
          borderWidth={0}
          unfilledColor="#2f2f2f"
          style={{ marginTop: 10 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  title: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 6,
  },
  value: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
