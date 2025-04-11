import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function PrivacyPolicy() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Information We Collect</Text>
        <Text style={styles.content}>
          We collect information that you provide directly to us, including but not limited to:
        </Text>
        <View style={styles.bulletPoints}>
          <Text style={styles.bulletPoint}>• Name and contact information</Text>
          <Text style={styles.bulletPoint}>• Account credentials</Text>
          <Text style={styles.bulletPoint}>• Profile information</Text>
          <Text style={styles.bulletPoint}>• Transaction data</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How We Use Your Information</Text>
        <Text style={styles.content}>
          We use the information we collect to:
        </Text>
        <View style={styles.bulletPoints}>
          <Text style={styles.bulletPoint}>• Provide and maintain our services</Text>
          <Text style={styles.bulletPoint}>• Process your transactions</Text>
          <Text style={styles.bulletPoint}>• Send you technical notices and support messages</Text>
          <Text style={styles.bulletPoint}>• Communicate with you about products, services, and events</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Information Sharing</Text>
        <Text style={styles.content}>
          We do not sell or rent your personal information to third parties. We may share your information only in the following circumstances:
        </Text>
        <View style={styles.bulletPoints}>
          <Text style={styles.bulletPoint}>• With your consent</Text>
          <Text style={styles.bulletPoint}>• To comply with legal obligations</Text>
          <Text style={styles.bulletPoint}>• To protect our rights and safety</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Security</Text>
        <Text style={styles.content}>
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Rights</Text>
        <Text style={styles.content}>
          You have the right to:
        </Text>
        <View style={styles.bulletPoints}>
          <Text style={styles.bulletPoint}>• Access your personal information</Text>
          <Text style={styles.bulletPoint}>• Correct inaccurate information</Text>
          <Text style={styles.bulletPoint}>• Request deletion of your information</Text>
          <Text style={styles.bulletPoint}>• Opt-out of marketing communications</Text>
        </View>
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
    marginBottom: 12,
  },
  bulletPoints: {
    paddingLeft: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 24,
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
});