// ✅ Final TasksScreen.js with user view via bottom modal button
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';


const initialTasks = [
  { id: '1', time: '08:00', task: 'Clean Room 12', date: 'Sun May 26 2025', completed: false, assignedTo: 'cleaners', repeat: 'once' },
  { id: '2', time: '09:00', task: 'Laundry Pickup', date: 'Sun May 26 2025', completed: true, assignedTo: 'cleaners', repeat: 'weekly' },
  { id: '3', time: '10:00', task: 'Restock Supplies', date: 'Sat May 25 2025', completed: false, assignedTo: 'maria', repeat: 'monthly' },
  { id: '4', time: '11:00', task: 'Check AC in Room 5', date: 'Sat May 25 2025', completed: true, assignedTo: 'guards', repeat: 'once' },
  { id: '5', time: '12:00', task: 'Inventory Check', date: 'Fri May 24 2025', completed: true, assignedTo: 'juan', repeat: 'once' },
];

const getWeekDays = () => {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - start.getDay());
  const week = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    week.push({
      id: day.toDateString(),
      label: day.toLocaleDateString('en-US', { weekday: 'short' }),
      day: day.getDate(),
      isToday: day.toDateString() === today.toDateString(),
      dateString: day.toDateString(),
    });
  }
  return week;
};

export default function TasksScreen({ navigation, route }) {
  const [weekDays, setWeekDays] = useState(getWeekDays());
  const [selectedDate, setSelectedDate] = useState(getWeekDays()[0]);
  const [tasks, setTasks] = useState(initialTasks);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);

  useEffect(() => {
    if (route.params?.newTask) {
      setTasks((prev) => [...prev, route.params.newTask]);
    }
    if (route.params?.updatedTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === route.params.updatedTask.id ? route.params.updatedTask : task
        )
      );
    }
    if (route.params?.scannedTaskId) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === route.params.scannedTaskId ? { ...task, completed: true } : task
        )
      );
    }
  }, [route.params?.newTask, route.params?.updatedTask, route.params?.scannedTaskId]);

  const toggleTaskCompletion = (id) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const editTask = (task) => {
    navigation.navigate('NewTask', { task });
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((t) => t.date === selectedDate.dateString);
  const pastTasks = tasks.filter((t) => t.date !== selectedDate.dateString);
  const currentMonthText = new Date().toLocaleString('en-US', { month: 'long' });
  const completedCount = filteredTasks.filter((t) => t.completed).length;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.monthTextHeader}>{currentMonthText}</Text>

      <FlatList
        data={weekDays}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.calendarContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.dateButton,
              selectedDate.dateString === item.dateString
                ? styles.selectedDate
                : item.isToday
                ? styles.todayButton
                : null,
            ]}
            onPress={() => setSelectedDate(item)}
          >
            <Text style={styles.dateLabel}>{item.label}</Text>
            <Text style={styles.dateNumber}>{item.day}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={[styles.summaryBannerFixed, { marginTop: 12 }]}>
        <Text style={styles.summaryTitle}>{filteredTasks.length} tasks to complete today</Text>
        <Text style={styles.summarySubtitle}>
          You’re {completedCount}/{filteredTasks.length} complete
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Today’s Tasks</Text>
      <ScrollView contentContainerStyle={styles.taskListContainer}>
        {filteredTasks.length === 0 ? (
          <Text style={styles.noTasksText}>No tasks for this day</Text>
        ) : (
          filteredTasks.map((item, index) => (
            <TouchableOpacity
              key={`${item.id}-${index}`}
              style={[styles.taskCardModern, item.completed && styles.completedTaskCard]}
              onPress={() => toggleTaskCompletion(item.id)}
              onLongPress={() => {
                Alert.alert(
                  'Task Options',
                  `What would you like to do with "${item.task}"?`,
                  [
                    { text: 'Edit', onPress: () => editTask(item) },
                    { text: 'Delete', onPress: () => deleteTask(item.id), style: 'destructive' },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.taskTitleModern, item.completed && styles.completedText]}>
                  {item.task}
                </Text>
                {!item.completed && (
                  <Ionicons name="ellipsis-vertical" size={16} color="#FF4DB8" />
                )}
              </View>
              <Text style={{ color: '#aaa', fontSize: 13, marginTop: 4 }}>
                {item.assignedTo ? `👤 ${item.assignedTo}` : ''} {item.repeat !== 'once' ? `🔁 ${item.repeat}` : ''}
              </Text>
              <View style={styles.taskMetaRow}>
                <Ionicons name="calendar-outline" size={14} color="#888" />
                <Text style={styles.taskDateModern}>
                  Due {item.date.split(' ').slice(1, 3).join(' ')}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}

        <Text style={styles.sectionTitle}>All Tasks</Text>
        <View style={styles.tabRow}>
          {['To do', 'In progress', 'Completed', 'On Review'].map((label) => (
            <TouchableOpacity style={styles.tabButton} key={label}>
              <Text style={styles.tabText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {pastTasks.map((item, index) => (
          <TouchableOpacity
            key={`${item.id}-past-${index}`}
            style={[styles.taskCardModern, item.completed && styles.completedTaskCard]}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[styles.taskTitleModern, item.completed && styles.completedText]}>
                {item.task}
              </Text>
              {!item.completed && (
                <Ionicons name="ellipsis-vertical" size={16} color="#FF4DB8" />
              )}
            </View>
            <Text style={{ color: '#aaa', fontSize: 13, marginTop: 4 }}>
              {item.assignedTo ? `👤 ${item.assignedTo}` : ''} {item.repeat !== 'once' ? `🔁 ${item.repeat}` : ''}
            </Text>
            <View style={styles.taskMetaRow}>
              <Ionicons name="calendar-outline" size={14} color="#888" />
              <Text style={styles.taskDateModern}>
                Due {item.date.split(' ').slice(1, 3).join(' ')}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomIcon} onPress={() => navigation.navigate('NewTask')}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomIcon} onPress={() => setCalendarVisible(true)}>
          <Ionicons name="calendar-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomIcon} onPress={() => setUserModalVisible(true)}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* User modal */}
      <Modal visible={userModalVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setUserModalVisible(false)}>
          <View style={styles.userModalBox}>
            <Text style={styles.modalHeader}>View User Tasks</Text>
            {['cleaners', 'guards', 'cooks', 'maria', 'juan'].map((user) => (
              <TouchableOpacity
                key={user}
                style={styles.userItem}
                onPress={() => {
                  setUserModalVisible(false);
                  navigation.navigate('UserTasks', { user });
                }}
              >
                <Text style={styles.userText}>{user.charAt(0).toUpperCase() + user.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={calendarVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
            <Text style={{ color: '#fff', fontSize: 18 }}>Full Calendar</Text>
            <TouchableOpacity onPress={() => setCalendarVisible(false)}>
              <Ionicons name="close" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
          <Calendar
            current={new Date().toISOString().split('T')[0]}
            onDayPress={(day) => {
              setSelectedDate({
                id: null,
                label: '',
                day: new Date(day.dateString).getDate(),
                isToday: false,
                dateString: new Date(day.dateString).toDateString(),
              });
              setCalendarVisible(false);
            }}
            theme={{
              backgroundColor: '#121212',
              calendarBackground: '#121212',
              textSectionTitleColor: '#ccc',
              dayTextColor: '#fff',
              todayTextColor: '#FF4DB8',
              selectedDayBackgroundColor: '#FF4DB8',
              selectedDayTextColor: '#fff',
              arrowColor: '#fff',
              monthTextColor: '#fff',
            }}
            style={{ margin: 10, borderRadius: 10 }}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },

  summaryBannerFixed: {
    backgroundColor: '#1f1f1f',
    padding: 16,
    marginTop: 0,
    marginBottom: 12,
    borderRadius: 16,
    marginHorizontal: 20,
  },
  summaryTitle: { color: '#00D97E', fontSize: 16, fontWeight: 'bold' },
  summarySubtitle: { color: '#ccc', fontSize: 14, marginTop: 4 },

  monthTextHeader: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  calendarContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    paddingBottom: 36,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20,
    marginVertical: 8,
  },
  dateButton: {
    width: 60,
    height: 60,
    backgroundColor: '#1e1e1e',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  todayButton: {
    borderWidth: 2,
    borderColor: '#FF4DB8',
  },
  selectedDate: {
    backgroundColor: '#FF4DB8',
  },
  dateLabel: {
    color: '#fff',
    fontSize: 12,
  },
  dateNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  taskListContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tabButton: {
    backgroundColor: '#292929',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tabText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },

  taskCardModern: {
    backgroundColor: '#1f1f1f',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
  },
  completedTaskCard: {
    backgroundColor: '#2c2c2c',
    opacity: 0.6,
  },
  taskTitleModern: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  taskDateModern: {
    fontSize: 13,
    color: '#aaa',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#777',
  },
  noTasksText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 60,
  },

  bottomBar: {
    position: 'absolute',
    bottom: 25,
    alignSelf: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 40,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 18,
    elevation: 10,
  },
  bottomIcon: {
    backgroundColor: '#FF4DB8',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  userModalBox: {
    backgroundColor: '#1f1f1f',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalHeader: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userItem: {
    paddingVertical: 12,
  },
  userText: {
    color: '#fff',
    fontSize: 16,
  },
});
