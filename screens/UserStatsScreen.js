import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export default function UserStatsScreen({ route }) {
  const { user } = route.params;

  // Sample stats
  const stats = {
    totalTasks: 42,
    avgTime: 18,
    completionRate: 87,
    role: 'Cleaner',
  };

  // Sample graph data
  const graphData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [17, 18, 16, 20, 19, 21, 18],
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{user}'s Stats</Text>
      <Text style={styles.role}>Role: {stats.role}</Text>

      {/* Summary Cards */}
      <View style={styles.cardRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalTasks}</Text>
          <Text style={styles.statLabel}>Tasks</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.avgTime}m</Text>
          <Text style={styles.statLabel}>Avg Time</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.completionRate}%</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {/* Graph */}
      <Text style={styles.graphTitle}>Avg Task Time This Week</Text>
      <LineChart
        data={graphData}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#1e1e1e',
          backgroundGradientFrom: '#1e1e1e',
          backgroundGradientTo: '#1e1e1e',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 255, 179, ${opacity})`,
          labelColor: () => '#ccc',
        }}
        bezier
        style={styles.chart}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00ffb3',
  },
  statLabel: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
  graphTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 12,
  },
});
