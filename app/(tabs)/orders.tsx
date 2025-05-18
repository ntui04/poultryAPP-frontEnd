import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,
  Pressable,
} from 'react-native';
import { Package2, Calendar, DollarSign, Store } from 'lucide-react-native';
import { router } from 'expo-router';
import apiz from '../services/api';
import { mediaUrl } from '../services/api';

interface Shop {
  id: number;
  name: string;
  lastname: string;
  image_url: string;
}

interface Product {
  id: number;
  product_name: string;
  image: string;
  price: number;
  shop: Shop;
}

interface Purchase {
  id: number;
  quantity: number;
  total_price: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  product: Product;
}

export default function Orders() {
  const [orders, setOrders] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const mediaUrl = 'http://192.168.89.32:8000/storage/';

  const fetchOrders = async () => {
    try {
      setError(null);
      const response = await apiz.get('/purchases');
      setOrders(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const navigateToShop = (shopId: number) => {
    router.push({
      pathname: '/shop/profile-shop/[id]',
      params: { id: shopId },
    });
  };

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
        <Text style={styles.title}>My Orders</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Package2 size={48} color="#94a3b8" />
            <Text style={styles.emptyText}>No orders found</Text>
            <Text style={styles.emptySubtext}>
              You haven't placed any orders yet
            </Text>
          </View>
        ) : (
          orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              {/* Shop Header Section */}
              {order.product.shop && (
                <Pressable
                  style={styles.shopHeader}
                  onPress={() => navigateToShop(order.product.shop.id)}
                >
                  <View style={styles.shopInfo}>
                    {order.product.shop.image_url ? (
                      <Image
                        source={{ uri: mediaUrl + order.product.shop.image_url }}
                        style={styles.shopLogo}
                      />
                    ) : (
                      <Store size={20} color="#64748b" />
                    )}
                    <Text style={styles.shopName}>
                      {order.product.shop.lastname || order.product.shop.name || 'Unknown Shop'}
                    </Text>
                  </View>
                  <Text style={styles.viewShop}>View Shop</Text>
                </Pressable>
              )}

              <View style={styles.orderHeader}>
                <View style={styles.statusContainer}>
                  <Text
                    style={[
                      styles.statusText,
                      order.status === 'completed' && styles.statusCompleted,
                      order.status === 'pending' && styles.statusPending,
                      order.status === 'cancelled' && styles.statusCancelled,
                    ]}
                  >
                    {order.status.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.orderMeta}>
                  <Calendar size={16} color="#64748b" />
                  <Text style={styles.dateText}>
                    {formatDate(order.created_at)}
                  </Text>
                </View>
              </View>

              <View style={styles.productContainer}>
                <Image
                  source={{ uri: mediaUrl + order.product.image }}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>
                    {order.product.product_name}
                  </Text>
                  <View style={styles.orderDetails}>
                    <Text style={styles.quantityText}>
                      Quantity: {order.quantity}
                    </Text>
                    <View style={styles.priceContainer}>
                      <DollarSign size={16} color="#2563eb" />
                      <Text style={styles.priceText}>
                        {Number(order.total_price || 0).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
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
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
  },
  orderCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  shopName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  viewShop: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusCompleted: {
    color: '#059669',
  },
  statusPending: {
    color: '#d97706',
  },
  statusCancelled: {
    color: '#dc2626',
  },
  orderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#64748b',
  },
  productContainer: {
    flexDirection: 'row',
    padding: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 8,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 14,
    color: '#64748b',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
    marginLeft: 4,
  },
});