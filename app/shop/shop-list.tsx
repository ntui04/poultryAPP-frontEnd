import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Search, MapPin, Star, Clock } from 'lucide-react-native';

export default function AgroVetShops() {
  const [searchQuery, setSearchQuery] = useState('');

  const shops = [
    {
      id: '1',
      name: 'Farm Supply Co.',
      rating: 4.8,
      reviews: 128,
      distance: '2.5 km',
      address: '123 Farmers Lane, Nairobi',
      image: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d',
      openingHours: '8:00 AM - 6:00 PM',
      isOpen: true,
    },
    {
      id: '2',
      name: 'Poultry Essentials',
      rating: 4.6,
      reviews: 95,
      distance: '3.8 km',
      address: '456 Market Street, Nairobi',
      image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e',
      openingHours: '9:00 AM - 7:00 PM',
      isOpen: true,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search agro-vet shops..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.shopList}>
        {shops.map((shop) => (
          <Pressable
            key={shop.id}
            style={styles.shopCard}
            onPress={() => router.push(`/agro-vet-shops/${shop.id}`)}
          >
            <Image source={{ uri: shop.image }} style={styles.shopImage} />
            <View style={styles.shopInfo}>
              <View style={styles.shopHeader}>
                <Text style={styles.shopName}>{shop.name}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#eab308" fill="#eab308" />
                  <Text style={styles.rating}>{shop.rating}</Text>
                  <Text style={styles.reviews}>({shop.reviews})</Text>
                </View>
              </View>

              <View style={styles.locationContainer}>
                <MapPin size={16} color="#64748b" />
                <Text style={styles.locationText}>{shop.address}</Text>
                <Text style={styles.distance}>{shop.distance}</Text>
              </View>

              <View style={styles.hoursContainer}>
                <Clock size={16} color="#64748b" />
                <Text style={styles.hoursText}>{shop.openingHours}</Text>
                {shop.isOpen && <Text style={styles.openBadge}>Open</Text>}
              </View>
            </View>
          </Pressable>
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  shopList: {
    padding: 16,
  },
  shopCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  shopImage: {
    width: '100%',
    height: 160,
  },
  shopInfo: {
    padding: 16,
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shopName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  reviews: {
    fontSize: 14,
    color: '#64748b',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#64748b',
  },
  distance: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hoursText: {
    flex: 1,
    fontSize: 14,
    color: '#64748b',
  },
  openBadge: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});