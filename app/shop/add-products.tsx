import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: '',
  });

  const handleSubmit = () => {
    // Implement create logic here
    console.log('Create product:', formData);
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