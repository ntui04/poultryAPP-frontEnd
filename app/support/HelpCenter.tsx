import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking
} from 'react-native';
import { Phone, Mail, MessageCircle, ExternalLink } from 'lucide-react-native';

export default function HelpCenter() {
  const contactOptions = [
    {
      id: 'phone',
      title: 'Call Us',
      description: 'Talk to our support team',
      icon: <Phone size={24} color="#2563eb" />,
      action: () => Linking.openURL('tel:+255626267471'),
    },
    {
      id: 'email',
      title: 'Email Support',
      description: 'Send us an email',
      icon: <Mail size={24} color="#2563eb" />,
      action: () => Linking.openURL('mailto:support@kukufarm.com'),
    },
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: <MessageCircle size={24} color="#2563eb" />,
      action: () => {/* Implement chat functionality */},
    },
  ];

  const faqItems = [
    {
      question: 'How do I create an account?',
      answer: 'To create an account, click on the "Sign Up" button and fill in your details including your name, email, and password.',
    },
    {
      question: 'How can I reset my password?',
      answer: 'You can reset your password by clicking on the "Forgot Password" link on the login screen and following the instructions sent to your email.',
    },
    {
      question: 'How do I update my profile?',
      answer: 'Go to your profile page and click on the "Edit Profile" button to update your information.',
    },
    // Add more FAQ items as needed
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Help Center</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.contactOptions}>
          {contactOptions.map((option) => (
            <Pressable
              key={option.id}
              style={styles.contactCard}
              onPress={option.action}
            >
              <View style={styles.iconContainer}>
                {option.icon}
              </View>
              <Text style={styles.contactTitle}>{option.title}</Text>
              <Text style={styles.contactDescription}>{option.description}</Text>
              <ExternalLink size={16} color="#64748b" />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {faqItems.map((item, index) => (
          <View key={index} style={styles.faqItem}>
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.answer}>{item.answer}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  contactOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  contactCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
  },
  faqItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});