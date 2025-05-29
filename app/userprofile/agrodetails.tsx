import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import apiz from '../services/api';

interface AgroDetails {
  education: string;
  experience: string;
  specialization: string;
}

export default function AgroDetailsScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [details, setDetails] = useState<AgroDetails>({
    education: '',
    experience: '',
    specialization: ''
  });

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const response = await apiz.get('/agro-officer/details');
      if (response.data?.data) {
        setDetails(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const response = await apiz.post('/agro-officer/details', details);
      
      if (response.data) {
        Alert.alert(
          'Success',
          'Professional details updated successfully',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update details'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4747" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Professional Details</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Education Background</Text>
          <TextInput
            style={styles.input}
            value={details.education}
            onChangeText={(text) => setDetails(prev => ({ ...prev, education: text }))}
            placeholder="Enter your education background"
            placeholderTextColor="#94a3b8"
            multiline
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Experience</Text>
          <TextInput
            style={styles.input}
            value={details.experience}
            onChangeText={(text) => setDetails(prev => ({ ...prev, experience: text }))}
            placeholder="Enter your professional experience"
            placeholderTextColor="#94a3b8"
            multiline
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Specialization</Text>
          <TextInput
            style={styles.input}
            value={details.specialization}
            onChangeText={(text) => setDetails(prev => ({ ...prev, specialization: text }))}
            placeholder="Enter your area of specialization"
            placeholderTextColor="#94a3b8"
            multiline
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, saving && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#FF4747',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FF4747',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});