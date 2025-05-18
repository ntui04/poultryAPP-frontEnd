import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Pressable,
  Linking,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Store,
  Package,
  Star,
  MessageCircle,
  Share2,
} from 'lucide-react-native';
import apiz from '../../services/api';
import { mediaUrl } from '../../services/api';

interface Shop {
  id: number;
  firstname: string;
  lastname: string;
  phone_number: string;
  email: string;
  profile_image: string;
  location: string;
  business_name: string;
  rating?: number;
  total_products?: number;
  total_reviews?: number;
}

export default function ShopDetails() {
  const { id } = useLocalSearchParams();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const mediaUrl = 'http://192.168.89.32:8000/storage/';

  const fetchShopDetails = async () => {
    try {
      setError(null);
      const response = await apiz.get(`/shops/${id}`);
      setShop(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch shop details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log("Fetching shop with ID:", id);
    fetchShopDetails();
  }, [id]);

  const handleCall = () => {
    if (shop?.phone_number) {
      Linking.openURL(`tel:${shop.phone_number}`);
    }
  };

 

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error || !shop) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Shop not found'}</Text>
        <Pressable style={styles.retryButton} onPress={fetchShopDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

 

  return (
    <View style={styles.container}>
      

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <Image
            source={
              shop.profile_image
                ? { uri: mediaUrl + shop.profile_image }
                : { uri: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop' }
            }
            style={styles.profileImage}
          />
          <Text style={styles.businessName}>{shop.business_name}</Text>
          <Text style={styles.ownerName}>
            {shop.firstname} {shop.lastname}
          </Text>

         
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <Pressable style={styles.infoRow} onPress={handleCall}>
            <Phone size={20} color="#2563eb" />
            <Text style={styles.infoText}>{shop.phone_number}</Text>
          </Pressable>
         
          <View style={styles.infoRow}>
            <MapPin size={20} color="#2563eb" />
            <Text style={styles.infoText}>{shop.location}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Shop</Text>
          <View style={styles.aboutContainer}>
            <Store size={20} color="#64748b" />
            <Text style={styles.aboutText}>
              Welcome to {shop.business_name}! We are your trusted source for quality agricultural products
              and farming supplies. With years of experience in serving the farming community, we pride
              ourselves on providing expert advice and top-notch customer service.
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.viewProductsButton}
          onPress={() => router.push({
            pathname: '/shop/products/[id]',
            params: { id }
          })}
        >
          <Text style={styles.viewProductsText}>View All Products</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
ShopDetails.options = {
  headerShown: false,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 500,
    height: 400,
    borderRadius: 10,
    marginBottom: 16,
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  ownerName: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 12,
  },
  aboutContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  aboutText: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
    marginLeft: 12,
  },
  viewProductsButton: {
    margin: 16,
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewProductsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
});