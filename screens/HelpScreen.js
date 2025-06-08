import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const faqs = [
  {
    question: 'How do I reset my password?',
    answer: 'Go to the Settings > Password section and follow the steps after verifying your PIN.',
  },
  {
    question: 'How do I assign tasks to staff?',
    answer: 'Only managers can assign tasks from the Tasks tab using the Add Task button.',
  },
  {
    question: 'How do I mark a room as cleaned?',
    answer: 'Open the room map, tap on the room, and update the status using the popup menu.',
  },
];

export default function HelpScreen() {
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (index) => {
    setExpanded(index === expanded ? null : index);
  };

  const contactSupport = () => {
    Linking.openURL('mailto:support@olafoapp.com?subject=Help%20Request');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>❓ Help & FAQs</Text>

        {faqs.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.faqItem}
            onPress={() => toggleExpand(index)}
          >
            <View style={styles.faqHeader}>
              <Ionicons
                name={expanded === index ? 'chevron-down' : 'chevron-forward'}
                size={20}
                color="#ccc"
              />
              <Text style={styles.faqQuestion}>{item.question}</Text>
            </View>
            {expanded === index && (
              <Text style={styles.faqAnswer}>{item.answer}</Text>
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.divider} />

        <Text style={styles.subHeader}>Need more help?</Text>
        <TouchableOpacity style={styles.contactBtn} onPress={contactSupport}>
          <Ionicons name="mail-outline" size={20} color="#fff" />
          <Text style={styles.contactText}>Contact Support</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.versionText}>App Version 1.0.0</Text>
          <Text style={styles.versionText}>© Olafo Motel 2025</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    padding: 20,
  },
  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  faqItem: {
    marginBottom: 16,
    backgroundColor: '#1e1e1e',
    padding: 14,
    borderRadius: 10,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  faqQuestion: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  faqAnswer: {
    color: '#bbb',
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginVertical: 30,
  },
  subHeader: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 12,
    fontWeight: '600',
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
  },
  contactText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  versionText: {
    color: '#666',
    fontSize: 12,
  },
});
