import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { MapPin, Clock, Phone, CreditCard as Edit2, Package } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import axios from 'axios'; // Import axios

export default function ShopProfile() {
  const [refreshing, setRefreshing] = useState(false);
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetchShopData();
  }, []);

  const fetchShopData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://192.168.96.32:8000/api/products'); // Replace with your backend endpoint
      setShopData(response.data);
    } catch (error) {
      console.error('Error fetching shop data:', error);
      // Handle error appropriately (e.g., show an error message)
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

  if (!shopData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Failed to load shop data.</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Image 
          source={{ uri: shopData.image }} 
          style={styles.coverImage}
        />
        <View style={styles.overlay} />
        <View style={styles.headerContent}>
          <Text style={styles.shopName}>{shopData.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★ {shopData.rating}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.actionButtons}>
          <Button
            onPress={() => router.push('/shop/edit')}
            variant="outline"
          >
            <View style={styles.buttonContent}>
              <Edit2 size={20} color="#2563eb" />
              <Text style={styles.buttonText}>Edit Profile</Text>
            </View>
          </Button>
          <Button
            onPress={() => router.push('/shop/products')}
          >
            <View style={styles.buttonContent}>
              <Package size={20} color="#ffffff" />
              <Text style={[styles.buttonText, styles.whiteText]}>Manage Products</Text>
            </View>
          </Button>
        </View>

        <Text style={styles.description}>{shopData.description}</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MapPin size={20} color="#64748b" />
            <Text style={styles.infoText}>{shopData.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Phone size={20} color="#64748b" />
            <Text style={styles.infoText}>{shopData.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Clock size={20} color="#64748b" />
            <Text style={styles.infoText}>
              {shopData.workingHours.days}{'\n'}
              {shopData.workingHours.open} - {shopData.workingHours.close}
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{shopData.totalProducts}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{shopData.totalOrders}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ... (your styles)
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});