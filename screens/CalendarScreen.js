import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { CommonActions } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const pastelColors = [
  '#E3E6FD', // light blue
  '#FDE3E3', // light red
  '#E3FDEB', // light green
  '#FDF6E3', // light yellow
  '#F3E3FD', // light purple
  '#E3FDF9', // light teal
];

const palette = [
  { base: '#00D97E', light: '#E6FBF3' }, // Green
  { base: '#FF4D4D', light: '#FFEAEA' }, // Red
  { base: '#FFB800', light: '#FFF8E1' }, // Yellow
  { base: '#4D8DFF', light: '#EAF2FF' }, // Blue
  { base: '#9C27B0', light: '#F5E6FA' }, // Purple
  { base: '#1DE9B6', light: '#E6FCF7' }, // Teal
];

const getMonthName = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'long' });
};

const getWeekDays = (selectedDate) => {
  if (!selectedDate || !(selectedDate instanceof Date) || isNaN(selectedDate.getTime())) {
    selectedDate = new Date();
  }
  const start = new Date(selectedDate);
  start.setDate(start.getDate() - start.getDay()); // Start from Sunday
  const week = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    week.push({
      date: day,
      label: day.toLocaleDateString('en-US', { weekday: 'short' }),
      day: day.getDate(),
      isToday: day.toDateString() === new Date().toDateString(),
    });
  }
  return week;
};

// Dummy event data with varied colors, similar to image
const eventColors = [
  '#333333', // Dark gray (Research plan)
  '#FFC107', // Orange (Team Meeting)
  '#2196F3', // Light blue (Design review)
  '#9C27B0', // Purple (PM Meeting)
  '#4CAF50', // Green (General task example)
];

let colorIndex = 0; // To cycle through colors

export default function CalendarScreen({ navigation, route }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);
  const tasks = route.params?.tasks || [];
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskModalVisible, setTaskModalVisible] = useState(false);

  useEffect(() => {
    const safeSelectedDate = selectedDate instanceof Date && !isNaN(selectedDate.getTime()) 
      ? selectedDate 
      : new Date();
    setWeekDays(getWeekDays(safeSelectedDate));
  }, [selectedDate]);

  const handleMonthChange = (direction) => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(prevMonth.getMonth() + direction);
      return newMonth;
    });
  };

  // Helper to parse time string ("HH:mm") to minutes since 00:00
  const parseTime = (t) => {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
  };

  // Timeline slots (e.g., 8:00 AM to 8:00 PM)
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = 8 + i * 1;
    const period = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return {
      label: `${displayHour}:00 ${period}`,
      value: `${hour.toString().padStart(2, '0')}:00`,
      hour,
    };
  });

  // Group tasks by start time (rounded to hour)
  const filteredTasks = tasks.filter(task => task?.date === selectedDate.toDateString());
  const tasksByTime = {};
  filteredTasks.forEach((task, idx) => {
    const colorIdx = idx % palette.length;
    const cardColor = palette[colorIdx].light;
    tasksByTime[parseTime(task.startTime || task.time) ? `${Math.floor(parseTime(task.startTime || task.time) / 60).toString().padStart(2, '0')}:00` : '08:00'] = tasksByTime[parseTime(task.startTime || task.time) ? `${Math.floor(parseTime(task.startTime || task.time) / 60).toString().padStart(2, '0')}:00` : '08:00'] || [];
    tasksByTime[parseTime(task.startTime || task.time) ? `${Math.floor(parseTime(task.startTime || task.time) / 60).toString().padStart(2, '0')}:00` : '08:00'].push({ ...task, _color: cardColor, _base: palette[colorIdx].base });
  });

  // Avatars/Initials helper
  const renderAvatars = (assignedTo) => {
    if (!assignedTo) return null;
    const users = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
    return (
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        {users.map((user, idx) => {
          // If user is an object with avatar, use it; else use initials
          if (user.avatar) {
            return (
              <View key={idx} style={styles.avatarCircle}>
                <Image source={{ uri: user.avatar }} style={styles.avatarImg} />
              </View>
            );
          }
          // Use initials
          const initials = user.name
            ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
            : (typeof user === 'string' ? user.charAt(0).toUpperCase() : '?');
          return (
            <View key={idx} style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>{initials}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  // Duration helper
  const getDuration = (task) => {
    const start = parseTime(task.startTime || task.time);
    const end = parseTime(task.endTime) || (start + 60);
    const duration = end - start;
    if (duration >= 60) return `${(duration / 60).toFixed(1)} hours`;
    return `${duration} min`;
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Tasks');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Top Calendar Strip */}
      <View style={[styles.calendarStripContainer, { paddingTop: 32 }]}>
        <View style={styles.calendarHeaderRowFixed}>
          <TouchableOpacity onPress={handleBack} style={{ marginRight: 8 }}>
            <Ionicons name="chevron-back" size={24} color="#222" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => handleMonthChange(-1)} style={{ marginRight: 2 }}>
              <Ionicons name="chevron-back" size={20} color="#222" />
            </TouchableOpacity>
            <Text style={[styles.calendarHeaderText, { textAlign: 'center', minWidth: 120 }]} numberOfLines={1} ellipsizeMode="tail">
              {getMonthName(currentMonth)}, {currentMonth.getFullYear()}
            </Text>
            <TouchableOpacity onPress={() => handleMonthChange(1)} style={{ marginLeft: 2 }}>
              <Ionicons name="chevron-forward" size={20} color="#222" />
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={weekDays}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => `day-${i}`}
          contentContainerStyle={styles.calendarDaysRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.dayCircle, item.isToday && styles.todayCircle, selectedDate.toDateString() === item.date.toDateString() && styles.selectedDayCircle]}
              onPress={() => setSelectedDate(item.date)}
            >
              <Text style={[styles.dayLabel, selectedDate.toDateString() === item.date.toDateString() && styles.selectedDayLabel]}>{item.label}</Text>
              <Text style={[styles.dayNumber, selectedDate.toDateString() === item.date.toDateString() && styles.selectedDayNumber]}>{item.day}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {/* Timeline */}
      <ScrollView style={styles.timelineScroll} contentContainerStyle={{ paddingBottom: 120 }}>
        {timeSlots.map((slot, idx) => (
          <View key={slot.value} style={styles.timelineRow}>
            <Text style={styles.timelineTime}>{slot.label}</Text>
            <View style={{ flex: 1 }}>
              {(tasksByTime[slot.value] || []).map((task, tIdx) => (
                <TouchableOpacity
                  key={tIdx}
                  style={[styles.taskCard, { backgroundColor: task._color }]}
                  activeOpacity={0.9}
                  onPress={() => { setSelectedTask(task); setTaskModalVisible(true); }}
                >
                  <Text style={styles.taskTitle}>{task.task}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                    <Ionicons name="time-outline" size={14} color="#888" style={{ marginRight: 4 }} />
                    <Text style={styles.taskDuration}>{getDuration(task)}</Text>
                  </View>
                  {renderAvatars(task.assignedTo)}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
      {/* Floating + Button */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('NewTask')}>
        <Ionicons name="add" size={36} color="#fff" />
      </TouchableOpacity>
      {/* Task Detail Modal */}
      <Modal
        visible={taskModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTaskModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentBox}>
            {selectedTask && (
              <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ color: '#222', fontSize: 20, fontWeight: 'bold' }}>{selectedTask.task}</Text>
                  <TouchableOpacity onPress={() => setTaskModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#222" />
                  </TouchableOpacity>
                </View>
                {selectedTask.description && (
                  <Text style={{ color: '#444', fontSize: 15, marginBottom: 10 }}>{selectedTask.description}</Text>
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <Ionicons name="time-outline" size={16} color="#00D97E" style={{ marginRight: 6 }} />
                  <Text style={{ color: '#222', fontSize: 15 }}>
                    {selectedTask.startTime && selectedTask.endTime
                      ? `${selectedTask.startTime} - ${selectedTask.endTime}`
                      : selectedTask.time || 'No time set'}
                  </Text>
                </View>
                {renderAvatars(selectedTask.assignedTo)}
                {selectedTask.status && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <Ionicons name={selectedTask.status === 'completed' ? 'checkmark-done' : 'time-outline'} size={16} color={selectedTask.status === 'completed' ? '#00D97E' : '#FFB800'} style={{ marginRight: 6 }} />
                    <Text style={{ color: selectedTask.status === 'completed' ? '#00D97E' : '#FFB800', fontSize: 15 }}>{selectedTask.status.charAt(0).toUpperCase() + selectedTask.status.slice(1)}</Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  calendarStripContainer: {
    backgroundColor: '#fff',
    paddingTop: 18,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  calendarHeaderRowFixed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: 48,
    maxHeight: 54,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  calendarHeaderText: {
    color: '#222',
    fontSize: 18,
    fontWeight: '700',
  },
  calendarDaysRow: {
    paddingHorizontal: 8,
    paddingBottom: 2,
  },
  dayCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 54,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  todayCircle: {
    borderWidth: 2,
    borderColor: '#00D97E',
  },
  selectedDayCircle: {
    backgroundColor: '#00D97E',
  },
  dayLabel: {
    color: '#888',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  dayNumber: {
    color: '#222',
    fontSize: 18,
    fontWeight: '700',
  },
  selectedDayLabel: {
    color: '#fff',
  },
  selectedDayNumber: {
    color: '#fff',
  },
  timelineScroll: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    marginTop: 0,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 80,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  timelineTime: {
    color: '#b0b0b0',
    fontSize: 13,
    width: 60,
    textAlign: 'right',
    paddingRight: 10,
    marginTop: 8,
  },
  taskCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    minWidth: 180,
    maxWidth: width - 110,
  },
  taskTitle: {
    color: '#222',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  taskDuration: {
    color: '#888',
    fontSize: 13,
    fontWeight: '500',
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  avatarImg: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  avatarInitial: {
    color: '#00D97E',
    fontWeight: 'bold',
    fontSize: 15,
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 30,
    backgroundColor: '#00D97E',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.20,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 18,
    zIndex: 102,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
  modalContentBox: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
});
