import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput } from 'react-native';
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
    const [shopData, setShopData] = useState<shopData[]>([]); // Initialize as an empty array
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
  
    useEffect(() => {
      const fetchShopData = async () => {
        setLoading(true);
        try {
          const response = await apiz.get('/products/farm',{
            headers:{Authorization: `Bearer ${token}`}
          })
    
          console.log("API Response:", response.data);
    
          // Update state with the fetched data
          setShopData(response.data);
        } catch (error) {
          console.error('Error fetching shop data:', error.response?.data || error.message);
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };
      fetchShopData();
    }, [token]);
  
    
              

  const handleDelete = (productId: number) => {
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
            <Image source={{ uri:mediaUrl + product.image }} style={styles.productImage} />
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
