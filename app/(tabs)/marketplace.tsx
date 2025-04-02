import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ShopProfile() {
  const [refreshing, setRefreshing] = useState(false);
  const [shopData, setShopData] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    setLoading(true);
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem('userToken');
      console.log("Retrieved Token:", token);

      if (!token) {
        console.error('No token found');
        setLoading(false);
        return;
      }

      // Set up the Authorization header
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      console.log("Request Headers:", headers);

      // Make the API request
      const response = await axios.get('http://192.168.118.32:8000/api/pataprod', { headers });

      console.log("API Response:", response.data);

      // Update state with the fetched data
      setShopData(response.data);
    } catch (error) {
      console.error('Error fetching shop data:');
      if (error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Data:', error.response.data);
      } else {
        console.error('Error Message:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

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
      {shopData.length > 0 ? (
        shopData.map((product) => (
          <View key={product.id} style={styles.productCard}>
            {/* <Image source={{ uri: product.image }} style={styles.image} /> */}
            <Text style={styles.productname}>{product.product_name}</Text>
            <Text style={styles.productPrice}>${product.price}</Text>
            {/* Add other product details as needed */}
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No products available.</Text>
        </View>
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