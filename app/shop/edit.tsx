import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/stores/auth';
import { Save, ArrowLeft } from 'lucide-react-native';
import apiz from '../services/api';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import {mediaUrl} from '../services/api';

export default function EditShop() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    phone_number: user?.phone_number || '',
    email: user?.email || '',
    location: user?.location || '',
    business_name: user?.business_name || '',
    profile_image: null as any, // For image file
    password: '',
    password_confirmation: '',
  });

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setFormData(prev => ({
          ...prev,
          profile_image: result.assets[0],
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };
const handleSubmit = async () => {
  try {
    setLoading(true);

    // Validate required fields
    const requiredFields = ['firstname', 'lastname', 'phone_number', 'email', 'location', 'business_name'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      Alert.alert(
        'Required Fields',
        `Please fill in all required fields: ${missingFields.join(', ')}`
      );
      return;
    }

    // Create FormData instance
    const submitData = new FormData();

    // Append all text fields
    submitData.append('firstname', formData.firstname);
    submitData.append('lastname', formData.lastname);
    submitData.append('phone_number', formData.phone_number);
    submitData.append('email', formData.email);
    submitData.append('location', formData.location);
    submitData.append('business_name', formData.business_name);

    // Only append password fields if a new password is being set
    if (formData.password) {
      if (formData.password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters long');
        return;
      }
      if (formData.password !== formData.password_confirmation) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      submitData.append('password', formData.password);
      submitData.append('password_confirmation', formData.password_confirmation);
    }

    // Append image if selected
    if (formData.profile_image?.uri) {
      const imageUri = formData.profile_image.uri;
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : 'image';

      submitData.append('profile_image', {
        uri: imageUri,
        name: filename,
        type,
      } as any);
    }

    // REMOVE the Content-Type header - let React Native set it automatically
    const response = await apiz.put('/agroshop/profiles', submitData);

    if (response.data.status === 'success') {
      Alert.alert('Success', response.data.message);
      router.back();
    } else {
      throw new Error(response.data.message || 'Failed to update profile');
    }

  } catch (error: any) {
    console.error('Profile update error:', error);
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
          <View style={styles.imageSection}>
            <Button 
              onPress={handleImagePick} 
              style={styles.imagePickerButton}
              variant="outline"
            >
              {formData.profile_image?.uri ? (
                <Image 
                  source={{ uri: formData.profile_image.uri }} 
                  style={styles.profileImage}
                />
              ) : user?.profile_image ? (
                <Image 
                  source={{ uri: `${mediaUrl}${user.profile_image}` }} 
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Camera size={24} color="#64748b" />
                  <Text style={styles.imagePlaceholderText}>Add Profile Image</Text>
                </View>
              )}
            </Button>
          </View>

          <Input
            label="First Name"
            value={formData.firstname}
            onChangeText={(text) => setFormData({ ...formData, firstname: text })}
            placeholder="Enter your first name"
            containerStyle={styles.field}
          />

          <Input
            label="Last Name"
            value={formData.lastname}
            onChangeText={(text) => setFormData({ ...formData, lastname: text })}
            placeholder="Enter your last name"
            containerStyle={styles.field}
          />

          <Input
            label="Business Name"
            value={formData.business_name}
            onChangeText={(text) => setFormData({ ...formData, business_name: text })}
            placeholder="Enter your business name"
            containerStyle={styles.field}
          />

          <Input
            label="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Enter your email"
            containerStyle={styles.field}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Phone Number"
            value={formData.phone_number}
            onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
            placeholder="Enter contact number"
            containerStyle={styles.field}
            keyboardType="phone-pad"
          />

          <Input
            label="Location"
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
            placeholder="Enter business location"
            containerStyle={styles.field}
          />

          <Input
            label="New Password (Optional)"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            placeholder="Enter new password"
            containerStyle={styles.field}
            secureTextEntry
          />

          <Input
            label="Confirm New Password"
            value={formData.password_confirmation}
            onChangeText={(text) => setFormData({ ...formData, password_confirmation: text })}
            placeholder="Confirm new password"
            containerStyle={styles.field}
            secureTextEntry
          />

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
  imageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imagePickerButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748b',
  },
});