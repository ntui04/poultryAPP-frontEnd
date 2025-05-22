import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Bell, 
  MessageCircle,
  Star,
  TrendingUp 
} from 'lucide-react-native';
import { productsApi, mediaUrl } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const categories = [
    { id: 1, name: 'Broilers', icon: '🐔' },
    { id: 2, name: 'Layers', icon: '🥚' },
    { id: 3, name: 'Feed', icon: '🌾' },
    { id: 4, name: 'Medicine', icon: '💊' },
    { id: 5, name: 'Equipment', icon: '⚙️' },
  ];

  // Fetch token on mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };
    fetchToken();
  }, []);

  // Fetch products when token is available
  const fetchProducts = async () => {
    try {
      const response = await productsApi.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: mediaUrl + item.image }}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.product_name}
        </Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.productPrice}>
          TSh {item.price.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search in Poultry Market"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.headerIcon}>
          <Bell size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon}>
          <ShoppingBag size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Categories */}
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesList}
        />

        {/* Banners */}
        <View style={styles.banner}>
          <Image
            source={require('../../assets/images/banner.jpg')}
            style={styles.bannerImage}
          />
          
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <FlatList
            data={products}
            renderItem={renderProductItem}
            numColumns={2}
            columnWrapperStyle={styles.productRow}
            keyExtractor={item => item.id.toString()}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FF4747',
    paddingTop: 48,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingHorizontal: 12,
    marginRight: 12,
    height: 36,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  headerIcon: {
    padding: 8,
  },
  categoriesList: {
    backgroundColor: '#fff',
    paddingVertical: 12,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 12,
    width: 60,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  banner: {
    marginVertical: 12,
    paddingHorizontal: 12,
  },
  bannerImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  section: {
    padding: 12,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: (width - 36) / 2,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: (width - 36) / 2,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 8,
  },
  productName: {
    fontSize: 14,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4747',
    marginBottom: 4,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  salesText: {
    fontSize: 12,
    color: '#666',
  },
});
