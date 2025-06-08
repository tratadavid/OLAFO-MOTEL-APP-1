import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AnimatedRing from '../components/AnimatedRing';

const tasksCompleted = 3;
const tasksTotal = 7;
const progress = tasksCompleted / tasksTotal;

const projects = [
  { id: '1', title: '🧹 Clean Room 8', tag: 'Today' },
  { id: '2', title: '🪚 Laundry Pickup', tag: 'Today' },
  { id: '3', title: '📦 Inventory Check', tag: 'Today' },
  { id: '4', title: '🛒 Restock Supplies', tag: 'Today' },
];

const tasks = [
  { id: '1', title: '✅ Clean Room 12' },
  { id: '2', title: '✅ Check AC in Room 5' },
  { id: '3', title: '✅ Maintenance Follow-Up' },
];

export default function QuickStatsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>Thursday, May 1</Text>
      <Text style={styles.header}>Quick Stats</Text>

      <View style={styles.progressContainer}>
        <AnimatedRing progress={progress} />
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#00D97E' }]} />
          <Text style={styles.legendText}>Completed</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#2f2f2f' }]} />
          <Text style={styles.legendText}>Remaining</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Tasks</Text>
      <FlatList
        data={projects}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ marginBottom: 20 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('TaskDetail', {
                title: item.title,
                tag: item.tag,
              })
            }
          >
            <Animatable.View
              animation="fadeInUp"
              delay={index * 120}
              duration={600}
            >
              <View style={styles.projectCard}>
                <Text style={styles.projectTitle}>{item.title}</Text>
                <Text style={styles.projectTag}>{item.tag}</Text>
              </View>
            </Animatable.View>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.sectionTitle}>Done-Tasks</Text>
      {tasks.map((task, index) => (
        <Animatable.View
          key={task.id}
          animation="fadeInRight"
          delay={index * 150}
          duration={500}
        >
          <View style={styles.taskRow}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#00D97E"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.taskText}>{task.title}</Text>
          </View>
        </Animatable.View>
      ))}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  dateText: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 6,
  },
  header: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    color: '#ccc',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 10,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    paddingBottom: 6,
  },
  projectCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 180,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  projectTitle: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 4,
  },
  projectTag: {
    color: '#aaa',
    fontSize: 12,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  taskText: {
    color: '#d4d4d4',
    fontSize: 15,
  },
  backButton: {
    marginTop: 30,
    backgroundColor: '#333',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 16,
  },
});
