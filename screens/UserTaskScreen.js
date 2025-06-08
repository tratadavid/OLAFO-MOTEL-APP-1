import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  Platform,
  LayoutAnimation,
  UIManager,
  Animated,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';

// Enable layout animation for Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function UserTaskScreen({ tasks }) {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = route.params;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const todayString = selectedDate.toDateString();

  const filteredTasks = tasks.filter(
    (t) => t.assignedTo === user && t.date === todayString
  );

  const pastTasks = tasks.filter(
    (t) => t.assignedTo === user && t.date !== todayString
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const onDateChange = (event, date) => {
    setShowPicker(false);
    if (date) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSelectedDate(date);
    }
  };

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [selectedDate, refreshing]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{user.charAt(0).toUpperCase() + user.slice(1)}'s Tasks</Text>
      <Text style={styles.subheader}>{todayString}</Text>

      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>📅 Change Date</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00D97E" />
        }
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Today’s Tasks</Text>
            {filteredTasks.length === 0 ? (
              <Text style={styles.noTasks}>📭 No tasks assigned for this day.</Text>
            ) : (
              filteredTasks.map((task, idx) => (
                <View key={idx} style={styles.taskCard}>
                  <Text style={styles.taskText}>📝 {task.task}</Text>
                  <Text style={styles.meta}>
                    {task.time} • {task.repeat !== 'once' ? `🔁 ${task.repeat}` : ''}
                  </Text>
                  <Text style={styles.status}>
                    {task.completed ? '✅ Completed' : '🕒 Pending'}
                  </Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Past Tasks</Text>
            {pastTasks.length === 0 ? (
              <Text style={styles.noTasks}>📭 No past tasks found.</Text>
            ) : (
              pastTasks.map((task, idx) => (
                <View key={idx} style={[styles.taskCard, styles.pastCard]}>
                  <Text style={styles.taskText}>📄 {task.task}</Text>
                  <Text style={styles.meta}>{task.date} • {task.time}</Text>
                  <Text style={styles.status}>
                    {task.completed ? '✅ Completed' : '🕒 Pending'}
                  </Text>
                </View>
              ))
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  subheader: {
    color: '#bbb',
    fontSize: 14,
    marginBottom: 8,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00D97E',
    marginBottom: 10,
  },
  taskCard: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  pastCard: {
    backgroundColor: '#2b2b2b',
    borderColor: '#444',
  },
  taskText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  meta: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 4,
  },
  status: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    color: '#00D97E',
  },
  noTasks: {
    color: '#888',
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 20,
  },
  dateButton: {
    marginBottom: 16,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#2e2e2e',
    borderRadius: 10,
  },
  dateButtonText: {
    color: '#00D97E',
    fontSize: 14,
  },
});
