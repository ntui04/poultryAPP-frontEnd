import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiz from '../services/api';



export default function ShopProfile() {
  const [refreshing, setRefreshing] = useState(false);
  const [shopData, setShopData] = useState([]); // Initialize as an empty array
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

  

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchShopData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {shopData.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No products available</Text>
        </View>
      ) : (
        shopData.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <Image source={{ uri:mediaUrl + product.image }} style={styles.productImage} />
            <View>
              <Text style={styles.productname}>{product.product_name}</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
              <Text style={styles.productPrice}>${product.price}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productname: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  productPrice: {
    fontSize: 16,
    color: '#64748b',
  },
  productDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#64748b',
  },
});