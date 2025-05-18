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

export default function ShopProfile() {
  const [refreshing, setRefreshing] = useState(false);
  const [shopData, setShopData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  // const mediaUrl = 'http://192.168.239.32:8000/storage/';
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [itemLoading, setItemLoading] = useState({});

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
            <View key={product.id} style={styles.productCard}>
              <Image
                source={{ uri: mediaUrl + product.image }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.product_name}</Text>
                <Text style={styles.productDescription}>
                  {product.description}
                </Text>
                <View style={styles.priceAndQuantity}>
                  <Text style={styles.productPrice}>
                    $
                    {(
                      product.price * (selectedQuantities[product.id] || 1)
                    ).toFixed(2)}
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
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563eb',
  },
  productDescription: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
    marginBottom: 16,
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
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    shadowColor: '#000',
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
