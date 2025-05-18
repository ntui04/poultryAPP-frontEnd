import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Search, Plus, CreditCard as Edit2, Trash2, Package } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import apiz from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shopData } from '@/utils/datatype';
import { mediaUrl } from '../services/api'; // Adjust the import path as necessary

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [shopData, setShopData] = useState<shopData[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [error, setError] = useState<string | null>(null);

  // const mediaUrl = 'http://192.168.239.32:8000/storage/';

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
        } else {
          setError('Please log in to view products');
          router.replace('/login');
        }
      } catch (error) {
        setError('Error accessing secure storage');
      }
    };

    fetchToken();
  }, []);

  const fetchShopData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiz.get('/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShopData(response.data);
    } catch (error) {
      setError('Failed to load products');
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchShopData();
    setRefreshing(false);
  };

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
              
              fetchShopData();
            } catch (error) {
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

  const filteredProducts = shopData.filter(product =>
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Products</Text>
        <Text style={styles.headerSubtitle}>Manage your product inventory</Text>
      </View>

      <View style={styles.toolbar}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>
        <Button 
          onPress={() => router.push({
            pathname: '/shop/add-products',
            params: { token }
          })}
          style={styles.addButton}
        >
          <View style={styles.buttonContent}>
            <Plus size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Add</Text>
          </View>
        </Button>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#0891b2" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContent}>
          <Package size={48} color="#94a3b8" />
          <Text style={styles.errorText}>{error}</Text>
          <Button onPress={fetchShopData} style={styles.retryButton}>
            Retry
          </Button>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.centerContent}>
          <Package size={48} color="#94a3b8" />
          <Text style={styles.emptyText}>No products found</Text>
          {searchQuery ? (
            <Text style={styles.emptySubtext}>Try adjusting your search</Text>
          ) : (
            <Text style={styles.emptySubtext}>Add your first product to get started</Text>
          )}
        </View>
      ) : (
        <ScrollView
          style={styles.productList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {filteredProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <Image 
                source={{ uri: mediaUrl + product.image }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <View style={styles.productHeader}>
                  <View style={styles.productTitles}>
                    <Text style={styles.productName}>{product.product_name}</Text>
                    <Text style={styles.productDescription} numberOfLines={2}>
                      {product.description}
                    </Text>
                  </View>
                  <View style={styles.productActions}>
                    <Pressable
                      style={[styles.actionButton, styles.editButton]}
                      onPress={() => router.push({
                        pathname: '/shop/edit-product',
                        params: { id: product.id }
                      })}
                    >
                      <Edit2 size={18} color="#2563eb" />
                    </Pressable>
                    <Pressable
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDelete(product.id)}
                    >
                      <Trash2 size={18} color="#ef4444" />
                    </Pressable>
                  </View>
                </View>
                <View style={styles.productMeta}>
                  <Text style={styles.productPrice}>TSH {product.price}</Text>
                  <Text style={styles.productStock}>
                    Stock: {product.stock_quantity || 0}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  toolbar: {
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
    color: '#0f172a',
  },
  addButton: {
    height: 40,
    paddingHorizontal: 16,
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748b',
  },
  retryButton: {
    marginTop: 16,
  },
  productList: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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
    marginBottom: 12,
  },
  productTitles: {
    flex: 1,
    marginRight: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  productActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: '#eff6ff',
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0891b2',
  },
  productStock: {
    fontSize: 14,
    color: '#64748b',
  },
});