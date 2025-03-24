import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function EditProduct() {
  const { id } = useLocalSearchParams();
  const [formData, setFormData] = useState({
    name: 'Layer Feed Premium',
    description: 'High-quality feed for laying hens',
    price: '2500',
    stock: '150',
    category: 'Feed',
    imageUrl: 'https://images.unsplash.com/photo-1620574387735-3624d75b2dbc',
  });

  useEffect(() => {
    // Fetch product data using id
    console.log('Fetch product:', id);
  }, [id]);

  const handleSubmit = () => {
    // Implement update logic here
    console.log('Update product:', id, formData);
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Input
          label="Product Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
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
          keyboardType="numeric"
        />

        <Input
          label="Stock Quantity"
          value={formData.stock}
          onChangeText={(text) => setFormData({ ...formData, stock: text })}
          placeholder="Enter stock quantity"
          keyboardType="numeric"
        />

        <Input
          label="Category"
          value={formData.category}
          onChangeText={(text) => setFormData({ ...formData, category: text })}
          placeholder="Enter product category"
        />

        <Input
          label="Image URL"
          value={formData.imageUrl}
          onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
          placeholder="Enter image URL"
        />

        <Button onPress={handleSubmit}>
          Save Changes
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