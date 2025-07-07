import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Placeholder: Replace with real user role logic
const isManager = true;

// Placeholder: Replace with real tasks data source/prop
const mockTasks = [
  {
    id: '1',
    task: 'Clean Room 12',
    description: 'Room cleaned, sheets changed.',
    photo: null, // Replace with image URI
    time: '08:00',
    date: new Date().toDateString(),
    assignedTo: 'cleaners',
    repeat: 'once',
    priority: 'medium',
    category: 'cleaning',
    status: 'pending',
    managerComment: '',
  },
  // ... more tasks
];

export default function ManagerPanelScreen({ navigation: navProp, tasks = mockTasks, onUpdateTask }) {
  const navigation = navProp || useNavigation();
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [workerFilter, setWorkerFilter] = useState('all');
  const [workerModalVisible, setWorkerModalVisible] = useState(false);

  if (!isManager) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.noAccess}>You do not have access to this panel.</Text>
      </SafeAreaView>
    );
  }

  // Get unique worker categories
  const workerCategories = Array.from(new Set(tasks.map(t => t.assignedTo)));

  // Sort: pending first, then approved, then rejected
  const sortedTasks = [...tasks].sort((a, b) => {
    const order = { pending: 0, approved: 1, rejected: 2 };
    return order[a.status || 'pending'] - order[b.status || 'pending'];
  });

  // Filter by status and worker
  const filteredTasks = sortedTasks.filter(task => {
    const statusMatch = statusFilter === 'all' ? true : (task.status || 'pending') === statusFilter;
    const workerMatch = workerFilter === 'all' ? true : task.assignedTo === workerFilter;
    return statusMatch && workerMatch;
  });

  const handleApprove = (task) => {
    if (onUpdateTask) {
      onUpdateTask(prev => prev.map(t => t.id === task.id ? { ...task, status: 'approved', managerComment: '' } : t));
    }
    setModalVisible(false);
    setSelectedTask(null);
  };

  const handleReject = (task) => {
    setRejectModalVisible(true);
  };

  const confirmReject = () => {
    if (onUpdateTask && selectedTask) {
      onUpdateTask(prev => prev.map(t => t.id === selectedTask.id ? { ...selectedTask, status: 'rejected', managerComment: rejectReason } : t));
    }
    setRejectModalVisible(false);
    setModalVisible(false);
    setSelectedTask(null);
    setRejectReason('');
  };

  // Back button handler
  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Main');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manager Task Approvals</Text>
          <View style={styles.backButton} />
        </View>
        {/* Filter Row */}
        <View style={styles.filterRow}>
          {['pending', 'approved', 'rejected'].map(status => (
            <TouchableOpacity
              key={status}
              style={[styles.statusFilterBtn, statusFilter === status && styles.statusFilterBtnActive]}
              onPress={() => setStatusFilter(status)}
            >
              <Text style={[styles.statusFilterText, statusFilter === status && styles.statusFilterTextActive]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={[styles.workerFilterBtn, workerFilter !== 'all' && styles.workerFilterBtnActive]}
            onPress={() => setWorkerModalVisible(true)}
          >
            <Ionicons name="filter" size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.workerFilterText}>
              {workerFilter === 'all' ? 'All Workers' : workerFilter.charAt(0).toUpperCase() + workerFilter.slice(1)}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#fff" style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.listContent}>
          {filteredTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-done-circle-outline" size={48} color="#666" />
              <Text style={styles.emptyText}>No submissions to review</Text>
            </View>
          ) : (
            filteredTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={[
                  styles.taskCard,
                  task.status === 'pending' && styles.pendingCard,
                  task.status === 'approved' && styles.approvedCard,
                  task.status === 'rejected' && styles.rejectedCard,
                ]}
                onPress={() => {
                  setSelectedTask(task);
                  setModalVisible(true);
                }}
              >
                <View style={styles.taskHeaderRow}>
                  <Text style={styles.taskTitle}>{task.task}</Text>
                  <View style={styles.statusBadge(task.status)}>
                    <Text style={styles.statusText}>{task.status ? task.status.charAt(0).toUpperCase() + task.status.slice(1) : 'Pending'}</Text>
                  </View>
                </View>
                <Text style={styles.taskMeta}>{task.date} • {task.time}</Text>
                <Text style={styles.taskMeta}>Assigned: {task.assignedTo}</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
        {/* Worker Filter Modal */}
        <Modal visible={workerModalVisible} transparent animationType="slide">
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setWorkerModalVisible(false)}>
            <View style={styles.workerModalBox}>
              <Text style={styles.workerModalTitle}>Filter by Worker</Text>
              <TouchableOpacity
                style={[styles.workerModalItem, workerFilter === 'all' && styles.workerModalItemActive]}
                onPress={() => { setWorkerFilter('all'); setWorkerModalVisible(false); }}
              >
                <Text style={[styles.workerModalText, workerFilter === 'all' && styles.workerModalTextActive]}>All Workers</Text>
              </TouchableOpacity>
              {workerCategories.map(worker => (
                <TouchableOpacity
                  key={worker}
                  style={[styles.workerModalItem, workerFilter === worker && styles.workerModalItemActive]}
                  onPress={() => { setWorkerFilter(worker); setWorkerModalVisible(false); }}
                >
                  <Text style={[styles.workerModalText, workerFilter === worker && styles.workerModalTextActive]}>
                    {worker.charAt(0).toUpperCase() + worker.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
        {/* Task Detail Modal */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.detailModalBox}>
              {selectedTask && (
                <>
                  <View style={styles.detailHeaderRow}>
                    <Text style={styles.detailTitle}>{selectedTask.task}</Text>
                    <TouchableOpacity onPress={() => { setModalVisible(false); setSelectedTask(null); }}>
                      <Ionicons name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  {selectedTask.photo ? (
                    <Image source={{ uri: selectedTask.photo }} style={styles.detailPhoto} />
                  ) : (
                    <View style={styles.noPhoto}><Ionicons name="image-outline" size={48} color="#888" /><Text style={styles.noPhotoText}>No photo submitted</Text></View>
                  )}
                  <Text style={styles.detailNoteLabel}>Employee's Note</Text>
                  <Text style={styles.detailDescription}>{selectedTask.description}</Text>
                  {selectedTask.status === 'rejected' && selectedTask.managerComment ? (
                    <View style={styles.rejectionBox}>
                      <Ionicons name="close-circle" size={18} color="#FF4D4D" />
                      <Text style={styles.rejectionText}>{selectedTask.managerComment}</Text>
                    </View>
                  ) : null}
                  <Text style={styles.detailMeta}>Assigned: {selectedTask.assignedTo}</Text>
                  <Text style={styles.detailMeta}>Date: {selectedTask.date} {selectedTask.time}</Text>
                  {(!selectedTask.status || selectedTask.status === 'pending') && (
                    <View style={styles.actionRow}>
                      <TouchableOpacity style={styles.approveBtn} onPress={() => handleApprove(selectedTask)}>
                        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                        <Text style={styles.actionText}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(selectedTask)}>
                        <Ionicons name="close-circle-outline" size={20} color="#fff" />
                        <Text style={styles.actionText}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        </Modal>
        {/* Reject Reason Modal */}
        <Modal visible={rejectModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.rejectModalBox}>
              <Text style={styles.rejectTitle}>Reason for Rejection</Text>
              <TextInput
                style={styles.rejectInput}
                placeholder="Describe what is missing or needs correction..."
                placeholderTextColor="#aaa"
                value={rejectReason}
                onChangeText={setRejectReason}
                multiline
              />
              <View style={styles.rejectActions}>
                <TouchableOpacity style={styles.rejectCancelBtn} onPress={() => setRejectModalVisible(false)}>
                  <Text style={styles.rejectCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectConfirmBtn} onPress={confirmReject}>
                  <Text style={styles.rejectConfirmText}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#181A20',
    paddingTop: Platform.OS === 'android' ? 32 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#181A20',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  noAccess: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 60,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  taskCard: {
    backgroundColor: '#23232a',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  pendingCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#FFB800',
  },
  approvedCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#00D97E',
    opacity: 0.7,
  },
  rejectedCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#FF4D4D',
    opacity: 0.7,
  },
  taskHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  taskTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: (status) => ({
    backgroundColor: status === 'approved' ? '#00D97E' : status === 'rejected' ? '#FF4D4D' : '#FFB800',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 3,
    marginLeft: 8,
  }),
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  taskMeta: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  detailModalBox: {
    backgroundColor: '#23232a',
    borderRadius: 18,
    padding: 24,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  detailHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    flexWrap: 'wrap',
  },
  detailDescription: {
    color: '#ccc',
    fontSize: 15,
    marginBottom: 12,
    marginTop: 2,
    lineHeight: 20,
  },
  detailPhoto: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#181A20',
  },
  noPhoto: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    marginBottom: 12,
    backgroundColor: '#181A20',
    borderRadius: 12,
  },
  noPhotoText: {
    color: '#888',
    marginTop: 8,
  },
  detailMeta: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 8,
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00D97E',
    borderRadius: 10,
    paddingVertical: 12,
    marginHorizontal: 2,
    gap: 6,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4D4D',
    borderRadius: 10,
    paddingVertical: 12,
    marginHorizontal: 2,
    gap: 6,
  },
  actionText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  rejectionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2b2b2b',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    marginBottom: 4,
    gap: 8,
  },
  rejectionText: {
    color: '#FF4D4D',
    fontSize: 14,
    flex: 1,
  },
  rejectModalBox: {
    backgroundColor: '#23232a',
    borderRadius: 18,
    padding: 24,
    width: '85%',
    alignSelf: 'center',
    marginTop: '40%',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  rejectTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  rejectInput: {
    backgroundColor: '#181A20',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    minHeight: 60,
    fontSize: 15,
    marginBottom: 18,
  },
  rejectActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  rejectCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  rejectCancelText: {
    color: '#fff',
    fontWeight: '600',
  },
  rejectConfirmBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#FF4D4D',
  },
  rejectConfirmText: {
    color: '#fff',
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#222',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    gap: 8,
  },
  statusFilterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#23232a',
    marginRight: 6,
  },
  statusFilterBtnActive: {
    backgroundColor: '#FF4DB8',
  },
  statusFilterText: {
    color: '#fff',
    fontSize: 14,
  },
  statusFilterTextActive: {
    fontWeight: '700',
  },
  workerFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#23232a',
    marginRight: 6,
  },
  workerFilterBtnActive: {
    backgroundColor: '#1DE9B6',
  },
  workerFilterText: {
    color: '#fff',
    fontSize: 14,
  },
  workerModalBox: {
    backgroundColor: '#23232a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  workerModalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  workerModalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  workerModalItemActive: {
    backgroundColor: '#1DE9B6',
  },
  workerModalText: {
    color: '#fff',
    fontSize: 16,
  },
  workerModalTextActive: {
    color: '#181A20',
    fontWeight: '700',
  },
  detailNoteLabel: {
    color: '#1DE9B6',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 2,
  },
}); 