import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { Search, Plus, CreditCard as Edit2, Trash2 } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import apiz from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shopData } from '@/utils/datatype';
import { Path } from 'react-native-svg';

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [shopData, setShopData] = useState<shopData[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const mediaUrl = 'http://192.168.239.32:8000/storage/';

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
        } else {
          console.error('No token found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching token from AsyncStorage:', error);
      }
    };

    fetchToken();
  }, []);

  const fetchShopData = async () => {
    setLoading(true);
    try {
      const response = await apiz.get('/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShopData(response.data);
    } catch (error) {
      console.error('Error fetching shop data:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchShopData();
    }
  }, [token]);

  const handleDelete = async (productId: number) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiz.delete(`/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              
              Alert.alert("Success", "Product deleted successfully");
              // Refresh the product list
              fetchShopData();
            } catch (error) {
              console.error('Error deleting product:', error.response?.data || error.message);
              Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to delete product"
              );
            }
          }
        }
      ]
    );
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
        <Button onPress={() => router.push({pathname: '/shop/add-products', params: {token:token}})}>
          <View style={styles.buttonContent}>
            <Plus size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Add Product</Text>
          </View>
        </Button>
      </View>

      <ScrollView style={styles.productList}>
        {shopData.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <Image source={{ uri: mediaUrl + product.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <View style={styles.productHeader}>
                <View>
                  <Text style={styles.productName}>{product.product_name}</Text>
                  <Text style={styles.productCategory}>{product.description}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  productList: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
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
    marginTop: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
});