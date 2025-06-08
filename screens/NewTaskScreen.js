// ✅ Final NewTaskScreen.js with custom modal dropdown for role assignment
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NewTaskScreen({ navigation, route }) {
  const editingTask = route.params?.task || null;

  const [taskName, setTaskName] = useState(editingTask ? editingTask.task : '');
  const [taskTime, setTaskTime] = useState(editingTask ? editingTask.time : '');
  const [taskDate, setTaskDate] = useState(
    editingTask ? new Date(editingTask.date) : new Date()
  );
  const [assignedTo, setAssignedTo] = useState(editingTask?.assignedTo || 'cleaners');
  const [repeat, setRepeat] = useState(editingTask?.repeat || 'once');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  const handleSave = () => {
    try {
      if (!taskName || !taskTime || !taskDate) {
        Alert.alert('Missing Info', 'Please fill in all fields.');
        return;
      }

      const updatedTask = {
        id: editingTask ? editingTask.id : Date.now().toString(),
        task: taskName,
        time: taskTime,
        date: taskDate.toDateString(),
        completed: editingTask ? editingTask.completed : false,
        assignedTo: assignedTo || 'unknown',
        repeat: repeat || 'once',
      };

      console.log('🚀 Saving Task:', updatedTask);

      navigation.navigate('Main', {
        screen: 'Tasks',
        params: editingTask
          ? { updatedTask, isEdit: true }
          : { newTask: updatedTask },
      });
    } catch (err) {
      console.error('❌ Error in handleSave:', err);
      Alert.alert('Error', 'Something went wrong while saving the task.');
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setTaskDate(selectedDate);
    }
    setShowDatePicker(Platform.OS === 'ios');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Clean Room 12"
        placeholderTextColor="#aaa"
        value={taskName}
        onChangeText={setTaskName}
      />

      <Text style={styles.label}>Time</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 14:30"
        placeholderTextColor="#aaa"
        value={taskTime}
        onChangeText={setTaskTime}
      />

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity onPress={openDatePicker} style={styles.datePickerButton}>
        <Text style={styles.datePickerText}>{taskDate.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={taskDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Text style={styles.label}>Assign To</Text>
      <TouchableOpacity onPress={() => setRoleModalVisible(true)} style={styles.selector}>
        <Text style={styles.selectorText}>{assignedTo || 'Select Role'}</Text>
      </TouchableOpacity>

      <Modal visible={roleModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {['cleaners', 'guards', 'cooks', 'maria', 'juan'].map((role) => (
              <TouchableOpacity
                key={role}
                style={styles.modalOption}
                onPress={() => {
                  setAssignedTo(role);
                  setRoleModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{role.charAt(0).toUpperCase() + role.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Text style={styles.label}>Repeat</Text>
      <TouchableOpacity
        onPress={() => setRepeat(repeat === 'once' ? 'weekly' : repeat === 'weekly' ? 'monthly' : 'once')}
        style={styles.selector}
      >
        <Text style={styles.selectorText}>{repeat === 'once' ? 'One-Time' : repeat.charAt(0).toUpperCase() + repeat.slice(1)}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {editingTask ? 'Update Task' : 'Save Task'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
    padding: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  datePickerButton: {
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  datePickerText: {
    color: '#fff',
    fontSize: 16,
  },
  selector: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 12,
    marginTop: 5,
    marginBottom: 20,
  },
  selectorText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    backgroundColor: '#1e1e1e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalOptionText: {
    color: '#fff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#FF4DB8',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
