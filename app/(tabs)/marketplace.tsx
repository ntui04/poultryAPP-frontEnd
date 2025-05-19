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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Search, ShoppingCart, Minus, Plus } from 'lucide-react-native';
import apiz, { productsApi } from '../services/api';
import { mediaUrl } from '../services/api';
import ProductDetailsModal from '../../components/ProductDetailsModal';

export default function ShopProfile() {
  const [refreshing, setRefreshing] = useState(false);
  const [shopData, setShopData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [itemLoading, setItemLoading] = useState({});
  const [imageLoadErrors, setImageLoadErrors] = useState<{[key: string]: boolean}>({});
  const [imageLoading, setImageLoading] = useState<{[key: string]: boolean}>({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

      // Initialize loading states
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

  const handleBuyNow = async (product) => {
    const quantity = selectedQuantities[product.id] || 1;
    const totalPrice = parseFloat((product.price * quantity).toFixed(2));

    try {
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
                // Set loading state only for this specific product
                setItemLoading((prev) => ({ ...prev, [product.id]: true }));

                await productsApi.purchase({
                  product_id: product.id,
                  quantity: quantity,
                  total_price: totalPrice,
                });

                Alert.alert(
                  'Success',
                  `Successfully purchased ${quantity} ${
                    quantity === 1 ? 'unit' : 'units'
                  } of ${product.product_name}!`
                );

                // Instead of refreshing all data, just update the specific product's quantity
                setSelectedQuantities((prev) => ({
                  ...prev,
                  [product.id]: 1, // Reset quantity to 1 after purchase
                }));
              } catch (error) {
                console.error('Purchase error:', error);
                Alert.alert(
                  'Error',
                  error.response?.data?.message ||
                    'Failed to process purchase. Please try again.'
                );
              } finally {
                // Reset loading state for this product
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
      <View style={styles.searchContainer}>
        <Search size={20} color="#64748b" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products....."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#94a3b8"
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No products available</Text>
          </View>
        ) : (
          filteredProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() => handleProductPress(product)}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: mediaUrl + product.image,
                    cache: 'reload',
                    headers: {
                      'Cache-Control': 'no-cache'
                    },
                  }}
                  style={styles.productImage}
                  onLoadStart={() => setImageLoading({...imageLoading, [product.id]: true})}
                  onLoadEnd={() => setImageLoading({...imageLoading, [product.id]: false})}
                  onError={() => setImageLoadErrors({...imageLoadErrors, [product.id]: true})}
                  resizeMode="contain"
                />
                {imageLoading[product.id] && (
                  <View style={styles.imageLoadingOverlay}>
                    <ActivityIndicator size="large" color="#2563eb" />
                  </View>
                )}
                {imageLoadErrors[product.id] && (
                  <View style={styles.imageErrorOverlay}>
                    <ShoppingCart size={32} color="#94a3b8" />
                    <Text style={styles.imageErrorText}>Failed to load image</Text>
                  </View>
                )}
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1} ellipsizeMode="tail">
                  {product.product_name}
                </Text>
                <Text style={styles.productDescription} numberOfLines={2} ellipsizeMode="tail">
                  {product.description}
                </Text>
                <View style={styles.priceAndQuantity}>
                  <Text style={styles.productPrice}>
                    TSH {(product.price * (selectedQuantities[product.id] || 1)).toFixed(2)}
                  </Text>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(product.id, -1)}
                    >
                      <Minus size={16} color="#64748b" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>
                      {selectedQuantities[product.id] || 1}
                    </Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(product.id, 1)}
                    >
                      <Plus size={16} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.buyButton,
                    itemLoading[product.id] && styles.buyButtonDisabled,
                  ]}
                  onPress={() => handleBuyNow(product)}
                  disabled={itemLoading[product.id]}
                >
                  {itemLoading[product.id] ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <>
                      <ShoppingCart
                        size={20}
                        color="#ffffff"
                        style={styles.buttonIcon}
                      />
                      <Text style={styles.buyButtonText}>Buy Now</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
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
        loading={itemLoading[selectedProduct?.id]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    backgroundColor: '#f8fafc',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 29,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    transform: [{ scale: 1 }], // Add this for press animation
  },
  productCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200, // Reduced height
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8fafc',
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
  imageErrorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageErrorText: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748b',
  },
  productInfo: {
    padding: 12, // Reduced padding
  },
  productName: {
    fontSize: 16, // Reduced font size
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563eb',
  },
  productDescription: {
    fontSize: 14, // Reduced font size
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 12,
  },
  priceAndQuantity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  buyButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buyButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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
