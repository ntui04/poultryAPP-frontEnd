import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function TermsConditions() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Terms & Conditions</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.content}>
          By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Use License</Text>
        <Text style={styles.content}>
          Permission is granted to temporarily download one copy of the application for personal, non-commercial transitory viewing only.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. User Account</Text>
        <Text style={styles.content}>
          To use certain features of the application, you must register for an account. You must provide accurate and complete information and keep your account information updated.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Privacy</Text>
        <Text style={styles.content}>
          Your use of the application is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the application and informs users of our data collection practices.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Disclaimer</Text>
        <Text style={styles.content}>
          The materials on the application are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </Text>
      </View>

      <Text style={styles.lastUpdated}>Last updated: January 2024</Text>
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
    marginBottom: 12,
  },
  content: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 24,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
});