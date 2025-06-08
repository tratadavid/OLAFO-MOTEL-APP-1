import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';
import AnimatedCircularTimer from './AnimatedCircularTimer';
import { useNavigation } from '@react-navigation/native';

export default function WidgetPanel() {
  const navigation = useNavigation();
  const scrollRef = useRef(null); // 📌 Add scroll ref
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAdminInsights, setShowAdminInsights] = useState(false);

  const categories = ['All', 'Cleaners', 'Cooks', 'Guards'];

  const leaderboardData = [
    { name: 'John Doe', percent: 0.83, role: 'Cleaners', avgTime: 15 },
    { name: 'Carlos V.', percent: 0.76, role: 'Cooks', avgTime: 12 },
    { name: 'Anna B.', percent: 0.65, role: 'Guards', avgTime: 18 },
    { name: 'Luis P.', percent: 0.52, role: 'Cleaners', avgTime: 20 },
  ];

  const filteredData =
    selectedCategory === 'All'
      ? leaderboardData
      : leaderboardData.filter((entry) => entry.role === selectedCategory);

  const handleLeaderboardPress = (name) => {
    navigation.navigate('UserStatsScreen', { user: name });
  };

  const toggleAdminInsights = () => {
    setShowAdminInsights((prev) => {
      const next = !prev;
      if (!prev) {
        setTimeout(() => {
          scrollRef.current?.scrollToEnd({ animated: true });
        }, 200);
      }
      return next;
    });
  };

  // Admin Metrics
  const topPerformer = leaderboardData.reduce((a, b) =>
    a.percent > b.percent ? a : b
  );
  const leastActive = leaderboardData.reduce((a, b) =>
    a.percent < b.percent ? a : b
  );
  const bestAvgTime = leaderboardData.reduce((a, b) =>
    a.avgTime < b.avgTime ? a : b
  );

  return (
    <ScrollView style={styles.container} ref={scrollRef}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.date}>Thursday, May 1</Text>
        <Text style={styles.title}>Productivity</Text>
      </View>

      {/* Search + Refresh */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search staff..."
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
        <Ionicons name="refresh" size={20} color="#888" style={{ marginLeft: 10 }} />
      </View>

      {/* Overview Section */}
      <Text style={styles.sectionHeader}>Overview</Text>
      <View style={styles.statsRow}>
        <AnimatedCircularTimer time="02:45" progress={0.65} />
        <View style={styles.statCard}>
          <Text style={styles.statValue}>51</Text>
          <Text style={styles.statLabel}>Tasks Done</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>19m</Text>
          <Text style={styles.statLabel}>Avg Task Time</Text>
        </View>
      </View>

      {/* Leaderboard Filter + Section */}
      <View style={styles.leaderboardHeader}>
        <Text style={styles.sectionHeader}>Leaderboard</Text>
        <View style={styles.dropdownContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.dropdownItem,
                selectedCategory === cat && styles.dropdownItemActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.dropdownText,
                  selectedCategory === cat && { color: '#111' },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {filteredData.map((entry, index) => (
        <TouchableOpacity
          key={index}
          style={styles.leaderItem}
          onPress={() => handleLeaderboardPress(entry.name)}
        >
          <Text style={styles.leaderName}>{index + 1}. {entry.name}</Text>
          <ProgressBar progress={entry.percent} color="#00ffb3" style={styles.progressBar} />
          <Text style={styles.leaderScore}>{Math.round(entry.percent * 100)}%</Text>
        </TouchableOpacity>
      ))}

      {/* Admin Button */}
      <TouchableOpacity style={styles.adminButton} onPress={toggleAdminInsights}>
        <Text style={styles.adminText}>📊 Admin Insights {showAdminInsights ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* Admin Insight Panel */}
      {showAdminInsights && (
        <View style={styles.adminPanel}>
          <TouchableOpacity onPress={() => handleLeaderboardPress(topPerformer.name)}>
            <Text style={styles.adminItem}>🏆 Top Performer: <Text style={styles.adminHighlight}>{topPerformer.name}</Text> ({Math.round(topPerformer.percent * 100)}%)</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLeaderboardPress(leastActive.name)}>
            <Text style={styles.adminItem}>😴 Least Active: <Text style={styles.adminHighlight}>{leastActive.name}</Text> ({Math.round(leastActive.percent * 100)}%)</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLeaderboardPress(bestAvgTime.name)}>
            <Text style={styles.adminItem}>⏱️ Fastest Avg Time: <Text style={styles.adminHighlight}>{bestAvgTime.name}</Text> ({bestAvgTime.avgTime}m)</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
  },
  headerSection: {
    marginBottom: 20,
  },
  date: {
    color: '#bbb',
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 30,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: 110,
  },
  statValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
  },
  leaderboardHeader: {
    marginTop: 30,
    marginBottom: 10,
  },
  dropdownContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  dropdownItem: {
    backgroundColor: '#222',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dropdownItemActive: {
    backgroundColor: '#00ffb3',
  },
  dropdownText: {
    color: '#fff',
    fontSize: 14,
  },
  leaderItem: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  leaderName: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 6,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
  },
  leaderScore: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'right',
    marginTop: 6,
  },
  adminButton: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 30,
  },
  adminText: {
    color: '#00ffb3',
    fontWeight: '600',
    fontSize: 16,
  },
  adminPanel: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  adminItem: {
    color: '#ddd',
    fontSize: 14,
    marginBottom: 12,
  },
  adminHighlight: {
    color: '#00ffb3',
    fontWeight: 'bold',
  },
});
