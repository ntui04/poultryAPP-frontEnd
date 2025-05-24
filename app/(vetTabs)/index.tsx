import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { MapPin, Clock, Phone, CreditCard as Edit2, Package, Star } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth';
import { mediaUrl } from '../services/api';

export default function ShopProfile() {
  const { user } = useAuthStore(); // Fetch user data from the store
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Add your refresh logic here
    setRefreshing(false);
  }, []);

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4747" />
        <Text style={styles.loadingText}>Loading shop data...</Text>
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
          source={{
            uri: user.profile_image
              ? `${mediaUrl}${user.profile_image}`
              : 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=2070&auto=format&fit=crop',
          }}
          style={styles.coverImage}
          resizeMode="cover"
          defaultSource={require('@/assets/images/placeholder-shop.png')} // Add a local placeholder
        />
        <View style={styles.overlay} />
        <View style={styles.headerContent}>
          <Text style={styles.shopName} numberOfLines={2}>
            {user.business_name || 'Business Name'}
          </Text>
          {user.rating && (
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FF4747" fill="#FF4747" strokeWidth={2.5} />
              <Text style={styles.rating}>{user.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.actionButtons}>
          <Button
            onPress={() => router.push('/shop/edit')}
            variant="outline"
            style={styles.editButton}
          >
            <View style={styles.buttonContent}>
              <Edit2 size={20} color="#FF4747" />
              <Text style={[styles.buttonText, styles.editButtonText]}>Edit Profile</Text>
            </View>
          </Button>
          <Button
            onPress={() => router.push('/products')}
            style={styles.primaryButton}
          >
            <View style={styles.buttonContent}>
              <Package size={20} color="#ffffff" />
              <Text style={[styles.buttonText, styles.whiteText]}>Manage Products</Text>
            </View>
          </Button>
        </View>

        <Text style={styles.description}>{user.description || 'No description available'}</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MapPin size={20} color="#64748b" />
            <Text style={styles.infoText}>{user.location || 'No location provided'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Phone size={20} color="#64748b" />
            <Text style={styles.infoText}>{user.phone_number || 'No phone number provided'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Clock size={20} color="#64748b" />
            <Text style={styles.infoText}>
              Monday - Saturday{'\n'}
              8:00 AM - 6:00 PM
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user.total_products || 0}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user.total_orders || 0}</Text>
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
    height: 280, // Increased height
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e2e8f0', // Placeholder color
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)', // Darker overlay
    backgroundImage: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))',
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 32,
  },
  shopName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: -0.5,
  },
  ratingContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rating: {
    fontSize: 15,
    color: '#FF4747',
    fontWeight: '700',
  },
  content: {
    padding: 24,
    marginTop: -32, // Increased overlap
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 32, // Increased radius
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16, // Increased gap
    marginBottom: 28,
  },
  editButton: {
    flex: 1,
    borderColor: '#FF4747',
    backgroundColor: '#fff2f2',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 9,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#FF4747',
    borderRadius: 16,
    padding: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  editButtonText: {
    color: '#FF4747',
  },
  whiteText: {
    color: '#ffffff',
  },
  description: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 24,
    marginBottom: 24,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 12,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF4747',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
});