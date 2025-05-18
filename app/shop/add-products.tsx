import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import apiz from '../services/api';
import { useLocalSearchParams } from 'expo-router';
import { Camera, DollarSign, Package, FileText } from 'lucide-react-native';
// import { mediaUrl } from '../services/api';

// const API_BASE_URL = 'http://192.168.239.32:8000/api';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    price: '',
    stock_quantity: '',
  });
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useLocalSearchParams();

  console.log(token);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        'Permission Denied',
        'You need to allow access to the gallery to upload an image.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // Disable editing
      quality: 1,
      aspect: undefined, // Remove aspect ratio constraint
      allowsMultipleSelection: false,
      base64: false,
      exif: true
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!formData.product_name || !formData.description || !formData.price || !image) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (!token) {
      Alert.alert('Error', 'Authentication token missing. Please log in again.');
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('product_name', formData.product_name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('stock_quantity', formData.stock_quantity);
      data.append('image', {
        uri: image,
        name: 'product_image.jpg',
        type: 'image/jpeg',
      });

      const response = await apiz.post('/products/add', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Success', 'Product added successfully!');
      router.back();
    } catch (error) {
      console.error('Error adding product:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to add product. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Add New Product</Text>
          <Text style={styles.subtitle}>Fill in the details below to add a new product</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Product Name"
            value={formData.product_name}
            onChangeText={(text) => setFormData({ ...formData, product_name: text })}
            placeholder="Enter product name"
            icon={<Package size={20} color="#64748b" />}
          />

          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <View style={styles.textareaContainer}>
              <FileText size={20} color="#64748b" style={styles.textareaIcon} />
              <TextInput
                style={styles.textarea}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Enter product description"
                multiline
                numberOfLines={4}
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          <Input
            label="Price (TSH)"
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
            placeholder="Enter price"
            keyboardType="numeric"
            icon={<DollarSign size={20} color="#64748b" />}
          />

          <Input
            label="Stock Quantity"
            value={formData.stock_quantity}
            onChangeText={(text) => setFormData({ ...formData, stock_quantity: text })}
            placeholder="Enter quantity"
            keyboardType="numeric"
            icon={<Package size={20} color="#64748b" />}
          />

          <View style={styles.imageSection}>
            <Text style={styles.label}>Product Image</Text>
            <View style={styles.imagePicker}>
              {image ? (
                <Image source={{ uri: image }} style={styles.imagePreview} />
              ) : (
                <View style={styles.imagePickerPlaceholder}>
                  <Camera size={32} color="#64748b" />
                  <Text style={styles.imagePickerText}>No image selected</Text>
                </View>
              )}
              <Button 
                onPress={pickImage}
                style={styles.imagePickerButton}
              >
                {image ? 'Change Image' : 'Select Image'}
              </Button>
            </View>
          </View>

          <Button
            onPress={handleSubmit}
            loading={isLoading}
            style={styles.submitButton}
          >
            Add Product
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  form: {
    padding: 24,
    gap: 20,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 8,
  },
  textareaContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textareaIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 1,
  },
  textarea: {
    flex: 1,
    minHeight: 120,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 44,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    textAlignVertical: 'top',
  },
  imageSection: {
    marginTop: 8,
  },
  imagePicker: {
    alignItems: 'center',
    gap: 16,
  },
  imagePickerPlaceholder: {
    width: '100%',
    height: 300, // Match the preview height
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  imagePreview: {
    width: '100%',
    height: 300, // Increased height
    borderRadius: 12,
    resizeMode: 'contain', // This will maintain aspect ratio
  },
  imagePickerButton: {
    width: '100%',
  },
  submitButton: {
    marginTop: 32,
    width: '100%',
  },
});