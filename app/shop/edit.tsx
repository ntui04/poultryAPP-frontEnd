import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/stores/auth';
import { Save, ArrowLeft } from 'lucide-react-native';
import apiz from '../services/api';

export default function EditShop() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.business_name || '',
    description: user?.description || '',
    address: user?.location || '',
    phone: user?.phone_number || '',
    openTime: '8:00 AM',
    closeTime: '6:00 PM',
    workingDays: 'Monday - Saturday',
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await apiz.put('/shop/profile', formData);
      Alert.alert('Success', 'Shop profile updated successfully');
      router.back();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update shop profile'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button 
          variant="ghost" 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </Button>
        <Text style={styles.headerTitle}>Edit Shop Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Input
            label="Business Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Enter your business name"
            containerStyle={styles.field}
          />

          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textarea}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Describe your business"
              multiline
              numberOfLines={4}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <Input
            label="Address"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            placeholder="Enter business address"
            containerStyle={styles.field}
          />

          <Input
            label="Phone Number"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="Enter contact number"
            containerStyle={styles.field}
            keyboardType="phone-pad"
          />

          <View style={styles.timeSection}>
            <Text style={styles.sectionTitle}>Business Hours</Text>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Input
                  label="Opening Time"
                  value={formData.openTime}
                  onChangeText={(text) => setFormData({ ...formData, openTime: text })}
                  placeholder="e.g. 8:00 AM"
                />
              </View>
              <View style={styles.halfField}>
                <Input
                  label="Closing Time"
                  value={formData.closeTime}
                  onChangeText={(text) => setFormData({ ...formData, closeTime: text })}
                  placeholder="e.g. 6:00 PM"
                />
              </View>
            </View>
          </View>

          <Button 
            onPress={handleSubmit} 
            style={styles.submitButton}
            disabled={loading}
          >
            <View style={styles.buttonContent}>
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Save size={20} color="#ffffff" />
                  <Text style={styles.buttonText}>Save Changes</Text>
                </>
              )}
            </View>
          </Button>
        </View>
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
    padding: 24,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  backButton: {
    padding: 2,
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 24,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 8,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
  },
  timeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfField: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#FF4747',
    marginTop: 6,
    padding: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});