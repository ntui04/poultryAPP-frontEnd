import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Search, Plus, CreditCard as Edit2, Trash2 } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');

  const products = [
    {
      id: '1',
      name: 'Layer Feed Premium',
      price: 2500,
      stock: 150,
      category: 'Feed',
      image: 'https://images.unsplash.com/photo-1620574387735-3624d75b2dbc',
    },
    {
      id: '2',
      name: 'Automatic Feeder',
      price: 5000,
      stock: 25,
      category: 'Equipment',
      image: 'https://images.unsplash.com/photo-1595508064774-5ff825ff0f81',
    },
  ];

  const handleDelete = (productId: string) => {
    // Implement delete logic
    console.log('Delete product:', productId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Button onPress={() => router.push('/shop/add-products')}>
          <View style={styles.buttonContent}>
            <Plus size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Add Product</Text>
          </View>
        </Button>
      </View>

      <ScrollView style={styles.productList}>
        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <View style={styles.productHeader}>
                <View>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productCategory}>{product.category}</Text>
                </View>
                <View style={styles.productActions}>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => router.push({
                      pathname: '/shop/edit-product',
                      params: { id: product.id }
                    })}
                  >
                    <Edit2 size={20} color="#2563eb" />
                  </Pressable>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleDelete(product.id)}
                  >
                    <Trash2 size={20} color="#ef4444" />
                  </Pressable>
                </View>
              </View>
              <View style={styles.productMeta}>
                <Text style={styles.productPrice}>KES {product.price}</Text>
                <Text style={styles.productStock}>Stock: {product.stock}</Text>
              </View>
            </View>
          </View>
        ))}
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
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  productList: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  productInfo: {
    padding: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: '#64748b',
  },
  productActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563eb',
  },
  productStock: {
    fontSize: 14,
    color: '#64748b',
  },
});