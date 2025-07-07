import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, FlatList, TouchableOpacity, TextInput, Image, ScrollView, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockSummary = [
  { key: 'total', label: 'Total Items', value: 120, icon: 'cube-outline', color: '#1DE9B6' },
  { key: 'low', label: 'Low Stock Items', value: 8, icon: 'trending-down-outline', color: '#FFC107' },
  { key: 'expired', label: 'Expired Items', value: 40, icon: 'alert-circle-outline', color: '#FF4DB8' },
  { key: 'out', label: 'Out of Stock Items', value: 15, icon: 'close-circle-outline', color: '#FF5252' },
];

const mockInventory = [
  { id: '1', name: 'Tomatoes', quantity: '120kg', location: 'Freezer', lastUpdated: 'Aug 15, 2024, 14:30', status: 'Good' },
  { id: '2', name: 'Chicken Breast', quantity: '40kg', location: 'Freezer', lastUpdated: 'Aug 15, 2024, 14:30', status: 'Low Stock' },
  { id: '3', name: 'Egg', quantity: '0kg', location: 'Freezer 2', lastUpdated: 'Aug 15, 2024, 14:30', status: 'Out of Stock' },
  { id: '4', name: 'Pasta', quantity: '40kg', location: 'Pantry', lastUpdated: 'Aug 15, 2024, 14:30', status: 'Expired' },
  { id: '5', name: 'Oil', quantity: '120kg', location: 'Pantry', lastUpdated: 'Aug 15, 2024, 14:30', status: 'Good' },
  { id: '6', name: 'Rice', quantity: '200kg', location: 'Pantry', lastUpdated: 'Aug 15, 2024, 14:30', status: 'Good' },
  { id: '7', name: 'Milk', quantity: '10L', location: 'Fridge', lastUpdated: 'Aug 15, 2024, 14:30', status: 'Low Stock' },
  { id: '8', name: 'Butter', quantity: '2kg', location: 'Fridge', lastUpdated: 'Aug 15, 2024, 14:30', status: 'Out of Stock' },
  { id: '9', name: 'Cheese', quantity: '5kg', location: 'Fridge', lastUpdated: 'Aug 15, 2024, 14:30', status: 'Expired' },
  { id: '10', name: 'Apples', quantity: '30kg', location: 'Pantry', lastUpdated: 'Aug 15, 2024, 14:30', status: 'Good' },
  { id: '11', name: 'Bananas', quantity: '0kg', location: 'Pantry', lastUpdated: 'Aug 15, 2024, 14:30', status: 'Out of Stock' },
  { id: '12', name: 'Oranges', quantity: '15kg', location: 'Pantry', lastUpdated: 'Aug 15, 2024, 14:30', status: 'Good' },
];

const statusColors = {
  'Good': '#1DE9B6',
  'Low Stock': '#FFC107',
  'Expired': '#FF4DB8',
  'Out of Stock': '#FF5252',
};

export default function InventoryScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [pressedRow, setPressedRow] = useState(null);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const filteredInventory = mockInventory.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Handlers for summary cards
  const handleSummaryPress = (card) => {
    let message = '';
    switch (card.key) {
      case 'total':
        message = `There are ${card.value} total items in stock.`;
        break;
      case 'low':
        message = 'Low stock items:\n' + (filteredInventory.filter(i => i.status === 'Low Stock').map(i => i.name).join(', ') || 'None');
        break;
      case 'expired':
        message = 'Expired items:\n' + (filteredInventory.filter(i => i.status === 'Expired').map(i => i.name).join(', ') || 'None');
        break;
      case 'out':
        message = 'Out of stock items:\n' + (filteredInventory.filter(i => i.status === 'Out of Stock').map(i => i.name).join(', ') || 'None');
        break;
      default:
        message = '';
    }
    setModalTitle(card.label);
    setModalContent(message);
    setModalVisible(true);
  };

  // Handlers for inventory actions
  const handleEdit = (item) => {
    setModalTitle('Edit Item');
    setModalContent(`Edit ${item.name}`);
    setModalVisible(true);
  };
  const handleDelete = (item) => {
    setModalTitle('Delete Item');
    setModalContent(`Delete ${item.name}?`);
    setModalVisible(true);
  };
  const handleView = (item) => {
    setModalTitle('View Item');
    setModalContent(`Viewing details for ${item.name}`);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Header with logo, green title, and profile icon */}
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.headerTitle}>Inventory</Text>
        <TouchableOpacity>
          <Ionicons name="person-circle-outline" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Main content: date/search, summary boxes, and list in a single flex: 1 container */}
      <View style={{ flex: 1 }}>
        {/* Date/Search Row */}
        <View style={styles.dateRow}>
          <Text style={styles.dateText}>{today}</Text>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#b0b0b0" style={{ marginRight: 6 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#b0b0b0"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>
        {/* Summary Cards directly below date/search row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.summaryScroll} contentContainerStyle={styles.summaryRow}>
          {mockSummary.map(card => (
            <TouchableOpacity
              key={card.key}
              style={[styles.summaryCard, { borderColor: card.color }]}
              activeOpacity={0.7}
              onPress={() => handleSummaryPress(card)}
            >
              <Ionicons name={card.icon} size={18} color={card.color} style={{ marginBottom: 4 }} />
              <Text style={styles.summaryValue}>{card.value}</Text>
              <Text style={styles.summaryLabel}>{card.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Inventory Table Header and List fill the rest of the screen */}
        <View style={{ flex: 1 }}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Item Name</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Qty</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Location</Text>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Last Updated</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Status</Text>
            <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}>Actions</Text>
          </View>
          <FlatList
            data={filteredInventory}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item, index }) => (
              <Pressable
                style={({ pressed }) => [
                  styles.tableRowCard,
                  pressed || pressedRow === item.id ? styles.tableRowCardPressed : null,
                  index !== filteredInventory.length - 1 ? styles.tableRowDivider : null,
                ]}
                onPressIn={() => setPressedRow(item.id)}
                onPressOut={() => setPressedRow(null)}
                onPress={() => {
                  setModalTitle('Item Details');
                  setModalContent(`Name: ${item.name}\nQty: ${item.quantity}\nLocation: ${item.location}\nStatus: ${item.status}`);
                  setModalVisible(true);
                }}
              >
                <Text style={[styles.tableCell, { flex: 2 }]}>{item.name}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>{item.location}</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>{item.lastUpdated}</Text>
                <View style={[styles.tableCell, styles.statusCell, { flex: 1 }]}> 
                  <View style={[styles.statusCircle, { backgroundColor: statusColors[item.status] || '#666' }]} />
                </View>
                <View style={[styles.tableCell, styles.actionsCell, { flex: 1 }]}> 
                  <TouchableOpacity style={styles.actionBtn} activeOpacity={0.6} onPress={() => handleDelete(item)}>
                    <Ionicons name="trash-outline" size={16} color="#FF4DB8" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} activeOpacity={0.6} onPress={() => handleView(item)}>
                    <Ionicons name="eye-outline" size={16} color="#1DE9B6" />
                  </TouchableOpacity>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No items found.</Text>}
            style={{ flex: 1 }}
          />
        </View>
      </View>
      {/* Add Item Floating Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
      {/* Custom Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalContent}>{modalContent}</Text>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A20',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#23232a',
  },
  logo: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  headerTitle: {
    color: '#1DE9B6',
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginLeft: -36, // visually center between logo and profile
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  dateText: {
    color: '#b0b0b0',
    fontSize: 14,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23232a',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
  },
  searchInput: {
    color: '#fff',
    fontSize: 15,
    minWidth: 100,
    padding: 0,
  },
  summaryScroll: {
    paddingHorizontal: 10,
    marginTop: -290,
    marginBottom: -285,
    paddingBottom: 0,
    paddingTop: 0,
  },
  summaryRow: {
    gap: 12,
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
    paddingBottom: 0,
    paddingTop: 0,
  },
  summaryCard: {
    backgroundColor: '#23232a',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    width: 150,
    marginRight: 12,
    height: 90,
    borderWidth: 2,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  summaryLabel: {
    color: '#b0b0b0',
    fontSize: 9,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#23232a',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginHorizontal: 10,
    marginBottom: 2,
    marginTop: 4,
  },
  tableHeaderText: {
    color: '#b0b0b0',
    fontWeight: 'bold',
    fontSize: 11,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  tableRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23232a',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 0,
    marginHorizontal: 10,
    shadowColor: '#1DE9B6',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(29,233,182,0.08)',
  },
  tableRowCardPressed: {
    backgroundColor: '#222b25',
    shadowOpacity: 0.18,
    borderColor: '#1DE9B6',
  },
  tableRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#23232a',
  },
  tableCell: {
    color: '#fff',
    fontSize: 11,
  },
  statusCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  statusCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  actionsCell: {
    flex: 1.2,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  actionBtn: {
    padding: 3,
    borderRadius: 6,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 28,
    backgroundColor: '#1DE9B6',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 10,
  },
  emptyText: {
    color: '#b0b0b0',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#23232a',
    borderRadius: 18,
    padding: 28,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#1DE9B6',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    color: '#1DE9B6',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalContent: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 18,
    textAlign: 'center',
  },
  modalCloseBtn: {
    backgroundColor: '#1DE9B6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  modalCloseText: {
    color: '#181A20',
    fontWeight: 'bold',
    fontSize: 15,
  },
}); 