import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { MapPin, Clock, Phone, CreditCard as Edit2, Plus, Package } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';

export default function ShopProfile() {
  const [refreshing, setRefreshing] = useState(false);
  
  const shopData = {
    name: "Farm Supply Co.",
    description: "Your one-stop shop for all poultry farming needs. We offer a wide range of quality products including feeds, medicines, equipment, and more.",
    address: "123 Farmers Lane, Nairobi",
    phone: "+254 712 345 678",
    workingHours: {
      open: "8:00 AM",
      close: "6:00 PM",
      days: "Monday - Saturday"
    },
    image: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d",
    rating: 4.8,
    totalProducts: 45,
    totalOrders: 128
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Implement refresh logic here
    setTimeout(() => setRefreshing(false), 1000);
  };

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
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    height: 200,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  shopName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  ratingContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  rating: {
    fontSize: 14,
    color: '#eab308',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  whiteText: {
    color: '#ffffff',
  },
  description: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 24,
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
});