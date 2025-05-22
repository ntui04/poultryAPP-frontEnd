import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Search, ShoppingCart, Minus, Plus } from 'lucide-react-native';
import apiz, { productsApi } from '../services/api';
import { mediaUrl } from '../services/api';
import ProductDetailsModal from '../../components/ProductDetailsModal';
import * as Location from 'expo-location';

export default function ShopProfile() {
  const [refreshing, setRefreshing] = useState(false);
  const [shopData, setShopData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [itemLoading, setItemLoading] = useState({});
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  const [imageLoading, setImageLoading] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const GOOGLE_API_KEY = 'AIzaSyCyzrcI5QUoMWtYxtvj7AkPfLUzLL5-WzU';

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

  const fetchShopData = async () => {
    setLoading(true);
    try {
      const response = await productsApi.getAll();
      setShopData(response.data);

      const initialLoadingStates = {};
      response.data.forEach((product) => {
        initialLoadingStates[product.id] = false;
      });
      setItemLoading(initialLoadingStates);
    } catch (error) {
      console.error('Error fetching shop data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchShopData();
    }
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchShopData();
    setRefreshing(false);
  };

  const fetchLocation = async () => {
    try {
      const cachedLocation = await AsyncStorage.getItem('userLocation');
      if (cachedLocation) {
        return JSON.parse(cachedLocation);
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Please allow location access to complete your purchase.',
          [{ text: 'OK' }]
        );
        return null;
      }

      const location = await Promise.race([
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Location request timed out')), 10000)
        ),
      ]);

      if (!location) {
        throw new Error('Failed to get location');
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error('Google Geocoding API error: ' + data.status);
      }

      const address = data.results[0];
      let city = null;
      let region = null;
      let country = null;

      for (const component of address.address_components) {
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
          region = component.long_name;
        }
        if (component.types.includes('country')) {
          country = component.long_name;
        }
      }

      const locationData = {
        city,
        region,
        country,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      await AsyncStorage.setItem('userLocation', JSON.stringify(locationData));

      return locationData;
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert(
        'Location Error',
        'Unable to fetch your location. Please check your device settings or network.',
        [{ text: 'OK' }]
      );
      return null;
    }
  };

  const handleBuyNow = async (product) => {
    const quantity = selectedQuantities[product.id] || 1;
    const totalPrice = parseFloat((product.price * quantity).toFixed(2));

    try {
      const location = await fetchLocation();
      if (!location) {
        Alert.alert('Error', 'Failed to fetch location. Please try again.');
        return;
      }

      Alert.alert(
        'Confirm Purchase',
        `Would you like to buy ${quantity} ${
          quantity === 1 ? 'unit' : 'units'
        } of ${product.product_name} for $${totalPrice}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Buy Now',
            onPress: async () => {
              try {
                setItemLoading((prev) => ({ ...prev, [product.id]: true }));

                await productsApi.purchase({
                  product_id: product.id,
                  quantity: quantity,
                  total_price: totalPrice,
                  location: {
                    city: location.city,
                    region: location.region,
                    country: location.country,
                    latitude: location.latitude,
                    longitude: location.longitude,
                  },
                });

                Alert.alert(
                  'Success',
                  `Successfully purchased ${quantity} ${
                    quantity === 1 ? 'unit' : 'units'
                  } of ${product.product_name}!`
                );

                setSelectedQuantities((prev) => ({
                  ...prev,
                  [product.id]: 1,
                }));
              } catch (error) {
                console.error('Purchase error:', error);
                Alert.alert(
                  'Error',
                  error.response?.data?.message ||
                    'Failed to process purchase. Please try again.'
                );
              } finally {
                setItemLoading((prev) => ({ ...prev, [product.id]: false }));
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to process purchase. Please try again.');
    }
  };

  const updateQuantity = (productId, amount) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + amount),
    }));
  };

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const filteredProducts = shopData.filter((product) =>
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products....."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
        </View>
        <TouchableOpacity style={styles.headerIcon}>
          <ShoppingCart size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.productsGrid}>
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyState}>
              <ShoppingCart size={48} color="#94a3b8" />
              <Text style={styles.emptyStateText}>No products available</Text>
            </View>
          ) : (
            <FlatList
              data={filteredProducts}
              renderItem={({ item: product }) => (
                <TouchableOpacity
                  style={styles.productCard}
                  onPress={() => handleProductPress(product)}
                >
                  <View style={styles.imageContainer}>
                    <Image
                      source={{
                        uri: mediaUrl + product.image,
                        headers: { 'Cache-Control': 'no-cache' },
                      }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                    {imageLoading[product.id] && (
                      <View style={styles.imageLoadingOverlay}>
                        <ActivityIndicator size="large" color="#FF4747" />
                      </View>
                    )}
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {product.product_name}
                    </Text>
                    <Text style={styles.productPrice}>
                      TSh {(product.price * (selectedQuantities[product.id] || 1)).toLocaleString()}
                    </Text>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(product.id, -1)}
                      >
                        <Minus size={16} color="#666" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>
                        {selectedQuantities[product.id] || 1}
                      </Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(product.id, 1)}
                      >
                        <Plus size={16} color="#666" />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={[styles.buyButton, itemLoading[product.id] && styles.buyButtonDisabled]}
                      onPress={() => handleBuyNow(product)}
                      disabled={itemLoading[product.id]}
                    >
                      {itemLoading[product.id] ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                      ) : (
                        <Text style={styles.buyButtonText}>Buy Now</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
              numColumns={2}
              columnWrapperStyle={styles.productRow}
              keyExtractor={item => item.id.toString()}
            />
          )}
        </View>
      </ScrollView>

      <ProductDetailsModal
        visible={isModalVisible}
        product={selectedProduct}
        onClose={() => setIsModalVisible(false)}
        onBuy={() => handleBuyNow(selectedProduct)}
        quantity={selectedQuantities[selectedProduct?.id] || 1}
        onUpdateQuantity={(amount) =>
          selectedProduct && updateQuantity(selectedProduct.id, amount)
        }
        loading={itemLoading[selectedProduct?.id] || purchaseLoading}
      />
    </View>
  );
}

const { width } = Dimensions.get('window');

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
    color: '#333',
  },
  headerIcon: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  productsGrid: {
    padding: 8,
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
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: (width - 36) / 2,
    backgroundColor: '#f8fafc',
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
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4747',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    padding: 4,
    marginBottom: 8,
  },
  quantityButton: {
    padding: 4,
  },
  quantityText: {
    fontSize: 14,
    color: '#333',
    minWidth: 24,
    textAlign: 'center',
  },
  buyButton: {
    backgroundColor: '#FF4747',
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  buyButtonDisabled: {
    backgroundColor: '#fca5a5',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
