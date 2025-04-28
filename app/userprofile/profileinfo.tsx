import { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/auth';
import { MapPin, Phone, Mail, Building2, LogOut, CreditCard as Edit } from 'lucide-react-native';

export default function Profile() {
  const { user } = useAuthStore();
  const mediaUrl = 'http://172.16.194.9:8000/storage/';

  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={
            user?.profile_image
              ? { uri:mediaUrl + user.profile_image }
              : { uri: 'data:image/png;base64,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' }
          }
          style={styles.profileImage}
        />
        <View style={styles.headerContent}>
          <Text style={styles.name}>{user?.firstname} {user?.lastname}</Text>
          <Text style={styles.role}>{user?.role}</Text>
        </View>
        
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.infoCard}>
          {user?.business_name && (
            <View style={styles.infoRow}>
              <Building2 size={20} color="#64748b" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Business Name</Text>
                <Text style={styles.infoValue}>{user.business_name}</Text>
              </View>
            </View>
          )}

          <View style={styles.infoRow}>
            <Phone size={20} color="#64748b" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{user?.phone_number}</Text>
            </View>
          </View>

          {user?.email && (
            <View style={styles.infoRow}>
              <Mail size={20} color="#64748b" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>
          )}

          {user?.location && (
            <View style={styles.infoRow}>
              <MapPin size={20} color="#64748b" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{user.location}</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 30,
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
    marginLeft: 8,
  },
  role: {
    fontSize: 16,
    color: '#64748b',
    textTransform: 'capitalize',
    marginLeft: 8,
  },
  editButton: {
    padding: 8,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1f2937',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
});