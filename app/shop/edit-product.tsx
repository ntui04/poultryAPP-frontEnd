import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import * as ImagePicker from 'expo-image-picker';
import apiz from '../services/api';

const mediaUrl = 'http://192.168.69.32:8000/storage/'; // Adjust as needed

export default function EditProduct() {
  const { id } = useLocalSearchParams();
  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    price: '',
    stock_quantity: '',
  });
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsFetching(true);
        const response = await apiz.get(`/products/${id}`);
        const product = response.data;
        
        setFormData({
          product_name: product.product_name,
          description: product.description,
          price: product.price.toString(),
          stock_quantity: product.stock_quantity.toString(),
        });
        
        if (product.image) {
          setCurrentImage(product.image);
        }
      } catch (error) {
        console.error('Error fetching product:', error.response?.data || error.message);
        Alert.alert('Error', 'Failed to load product data');
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to allow access to the gallery to upload an image.');
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
    if (!formData.product_name || !formData.description || !formData.price || !formData.stock_quantity) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields explicitly
      formDataToSend.append('product_name', formData.product_name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('stock_quantity', formData.stock_quantity.toString());
      
      if (image) {
        // Get the file extension from the image URI
        const imageUriParts = image.split('.');
        const fileExtension = imageUriParts[imageUriParts.length - 1];
        
        formDataToSend.append('image', {
          uri: image,
          name: `product_image.${fileExtension}`,
          type: `image/${fileExtension}`
        });
      }

      const response = await apiz.post(`/products/${id}`, formDataToSend, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data, headers) => {
          return formDataToSend; // Prevent axios from trying to transform FormData
        },
      });

      Alert.alert('Success', 'Product updated successfully!');
      router.back();
    } catch (error) {
      console.error('Error updating product:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update product. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <View style={[styles.container, styles.loading]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading product data...</Text>
      </View>
    );
  }

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
          label="Price (TSH)"
          value={formData.price}
          onChangeText={(text) => setFormData({ ...formData, price: text })}
          placeholder="Enter price"
          keyboardType="numeric"
        />

        <Input
          label="Stock Quantity"
          value={formData.stock_quantity}
          onChangeText={(text) => setFormData({ ...formData, stock_quantity: text })}
          placeholder="Enter quantity"
          keyboardType="numeric"
        />

        <View style={styles.imageSection}>
          <Text style={styles.label}>Product Image</Text>
          
          {currentImage && !image && (
            <Image 
              source={{ uri: mediaUrl + currentImage }} 
              style={styles.imagePreview} 
            />
          )}
          
          {image && (
            <Image 
              source={{ uri: image }} 
              style={styles.imagePreview} 
            />
          )}
          
          <Button 
            onPress={pickImage} 
            style={styles.imageButton}
          >
            {currentImage ? 'Change Image' : 'Add Product Image'}
          </Button>
        </View>

        <View style={styles.actionButton}>
          <Button 
            onPress={handleSubmit} 
            loading={isLoading}
          >
            Save Changes
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
  imageSection: {
    marginVertical: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  imageButton: {
    marginTop: 8,
  },
  actionButton: {
    marginTop: 16,
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#6b7280',
  },
});