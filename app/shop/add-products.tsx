import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.118.32:8000/api'; // Replace with your backend URL

export default function AddProduct() {
  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    price: '',
    imageUrl: '',
  });

  

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // Validate input fields
    if (!formData.product_name || !formData.description || !formData.price) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare form data for the API
      const data = new FormData();
      data.append('product_name', formData.product_name);
      data.append('description', formData.description);
      data.append('price', formData.price);

      // If an image URL is provided, include it
      if (formData.imageUrl) {
        data.append('image', {
          uri: formData.imageUrl,
          name: 'product_image.jpg',
          type: 'image/jpeg',
        });
      }

      // Make API request
      const token = await AsyncStorage.getItem('authToken'); // Retrieve token from storage
      const response = await axios.post(`${API_BASE_URL}/products`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      

      // Handle success
      Alert.alert('Success', 'Product added successfully!');
      router.back(); // Navigate back to the previous screen
    } catch (error) {
      console.error('Error adding product:', (error as any).response?.data || (error as any).message);
      Alert.alert('Error', (error as any).response?.data?.message || 'Failed to add product. Please try again.');
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
          onChangeText={(text) => setFormData({ ...formData, product_name: text })}
          placeholder="Enter product name"
        />

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textarea}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Enter product description"
            multiline
            numberOfLines={4}
          />
        </View>

        <Input
          label="Price (KES)"
          value={formData.price}
          onChangeText={(text) => setFormData({ ...formData, price: text })}
          placeholder="Enter price"
        />

        <Input
          label="Image URL"
          value={formData.imageUrl}
          onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
          placeholder="Enter image URL"
        />

        <Button onPress={handleSubmit} loading={isLoading}>
          Add Product
        </Button>
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
});