import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import apiz from '../services/api';
import { useLocalSearchParams, useSearchParams } from 'expo-router/build/hooks';

const API_BASE_URL = 'http://192.168.239.32:8000/api'; // Corrected API URL

export default function AddProduct() {
  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    price: '',
  });
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useLocalSearchParams();

  // Fetch token when component mounts

  console.log(token);
  // Function to pick an image from the gallery
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        'Permission Denied',
        'You need to allow access to the gallery to upload an image.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.product_name ||
      !formData.description ||
      !formData.price ||
      !image
    ) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (!token) {
      Alert.alert(
        'Error',
        'Authentication token missing. Please log in again.'
      );
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
      console.error(
        'Error adding product:',
        error.response?.data || error.message
      );
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Failed to add product. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Input
          label="Product Name"
          value={formData.product_name}
          onChangeText={(text) =>
            setFormData({ ...formData, product_name: text })
          }
          placeholder="Enter product name"
        />

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textarea}
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
            placeholder="Enter product description"
            multiline
            numberOfLines={4}
          />
        </View>

        <Input
          label="Price (TSH)"
          value={formData.price}
          onChangeText={(text) => setFormData({ ...formData, price: text })}
          placeholder="Enter price"
          keyboardType="numeric"
        />

        <Input
          label="stock quantity"
          value={formData.stock_quantity}
          onChangeText={(text) => setFormData({ ...formData, stock_quantity: text })}
          placeholder="Enter quantity"
          keyboardType="numeric"
        />

        {/* Image Picker */}
        <View style={styles.imagePicker}>
          <Button onPress={pickImage}>Pick an Image</Button>
          {image && (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          )}
        </View>

        <View style={styles.btnAdd}>
          <Button onPress={handleSubmit} loading={isLoading}>
            Add Product
          </Button>
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
  form: {
    padding: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    marginVertical: 20,
    alignItems: 'center',
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});
