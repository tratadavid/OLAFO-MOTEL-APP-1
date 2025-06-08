// TaskDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TaskDetailScreen({ route }) {
  const { title, tag } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.tag}>Scheduled for: {tag}</Text>
      <Text style={styles.details}>More task details will go here...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tag: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 20,
  },
  details: {
    color: '#ccc',
    fontSize: 16,
  },
});
