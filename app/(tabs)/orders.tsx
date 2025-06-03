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
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Package2, Calendar, DollarSign, Store, Check, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import apiz from '../services/api';
import { mediaUrl } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Shop {
  id: number | null;
  name: string;
  lastname: string;
}

interface Product {
  id: number;
  product_name: string;
  image: string;
  price: number;
  shop: Shop;
}

// First, update the Purchase interface to allow for all possible status values
interface Purchase {
  id: number;
  quantity: number;
  total_price: number;
  status: 'pending' | 'completed' | 'cancelled' | 'delivered'; // Added 'delivered'
  status_text: string;
  status_color: string;
  payment_status: string;
  payment_reference: string;
  created_at: string;
  product: Product;
}

interface OrdersResponse {
  cancelled: Purchase[];
  completed: Purchase[];
  pending: Purchase[];
  processing?: Purchase[];
  delivered?: Purchase[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Purchase[]>([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setError(null);
      const response = await apiz.get('/purchases');
      
      if (response.data) {
        // Combine all orders from all status arrays
        const allOrders = Object.values(response.data)
          .filter(Array.isArray)
          .flat() as Purchase[];

        if (allOrders.length > 0) {
          // Sort by created_at date, most recent first
          allOrders.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setOrders(allOrders);
          console.log('Total orders loaded:', allOrders.length); // Debug log
        } else {
          setOrders([]);
        }
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || 'Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getUserPhone = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUserPhone(user.phone_number);
      }
    } catch (error) {
      console.error('Error getting user phone:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    getUserPhone();
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

  const getStatusStyle = (status: string, color: string) => ({
    color: color,
    backgroundColor: `${color}15`,
  });

  // Then update the updateOrderStatus function
  const updateOrderStatus = async (orderId: number, newStatus: Purchase['status']) => {
    try {
      const response = await apiz.put(`/purchases/${orderId}/status`, {
        status: newStatus
      });

      if (response.data) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? {
                  ...order,
                  status: newStatus,
                  status_text: getStatusText(newStatus)
                } as Purchase
              : order
          )
        );
        Alert.alert('Success', 'Order status updated successfully');
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Order Completed';
      case 'delivered':
        return 'Order Delivered';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const retryPayment = async (purchase: Purchase) => {
    try {
      if (!userPhone) {
        Alert.alert('Error', 'Phone number not found. Please update your profile.');
        return;
      }

      const response = await apiz.post(`/payments/retry/${purchase.id}`, {
        phone_number: userPhone
      });

      if (response.data.status === 'success') {
        Alert.alert(
          'Payment Initiated',
          'Please check your phone for the M-PESA prompt and enter your PIN to complete payment.',
          [
            {
              text: 'OK',
              onPress: () => {
                if (response.data.data?.reference) {
                  checkPaymentStatus(response.data.data.reference);
                }
              },
            },
          ]
        );
      } else {
        throw new Error(response.data.message || 'Payment retry failed');
      }
    } catch (error: any) {
      console.error('Payment retry error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to retry payment. Please try again.'
      );
    }
  };

  const checkPaymentStatus = (reference: string) => {
    let attempts = 0;
    const maxAttempts = 5;
    
    const checkInterval = setInterval(async () => {
      try {
        const response = await apiz.get(`/payments/status/${reference}`);
        attempts++;

        if (response.data.status === 'completed') {
          clearInterval(checkInterval);
          Alert.alert('Success', 'Payment completed successfully!');
          fetchOrders(); // Refresh orders list
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          Alert.alert(
            'Payment Status',
            'Unable to confirm payment status. If you completed the payment, it will be processed shortly.'
          );
        }
      } catch (error) {
        clearInterval(checkInterval);
        console.error('Payment status check failed:', error);
      }
    }, 5000); // Check every 5 seconds
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
        <Text style={styles.title}>Orders</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>All Orders</Text>
            <ArrowLeft size={16} color="#64748b" style={{ transform: [{ rotate: '-90deg' }] }} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF4747" />
          </View>
        ) : error ? (
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
            <View key={`order-${order.id}`} style={styles.orderCard}>
              {/* Shop Header Section */}
              {order.product.shop && (
                <Pressable
                  style={styles.shopHeader}
                  onPress={() => navigateToShop(order.product.shop.id!)}
                >
                  <View style={styles.shopInfo}>
                    <Store size={20} color="#64748b" />
                    <Text style={styles.shopName}>
                      {order.product.shop.lastname || order.product.shop.name || 'Unknown Shop'}
                    </Text>
                  </View>
                  <Text style={styles.viewShop}>View Shop</Text>
                </Pressable>
              )}

              <View style={styles.orderHeader}>
                <View style={styles.statusContainer}>
                  <Text style={[
                    styles.statusText,
                    getStatusStyle(order.status, order.status_color)
                  ]}>
                    {order.status_text}
                  </Text>
                </View>
                {order.payment_status === 'pending' && (
                  <View style={styles.paymentStatus}>
                    <Text style={styles.paymentStatusText}>Payment Required</Text>
                  </View>
                )}
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

              {/* Update the action buttons conditional rendering */}
              {(order.status === 'delivered' || (order.status === 'pending' && order.payment_status === 'pending')) && (
                <View style={styles.actionButtons}>
                  {order.status === 'delivered' && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.receiveButton]}
                      onPress={() => {
                        Alert.alert(
                          'Confirm Reception',
                          'Have you received this order?',
                          [
                            { text: 'No', style: 'cancel' },
                            {
                              text: 'Yes, Received',
                              onPress: () => updateOrderStatus(order.id, 'completed')
                            }
                          ]
                        );
                      }}
                    >
                      <Check size={20} color="#fff" style={styles.actionIcon} />
                      <Text style={styles.actionButtonText}>Mark as Received</Text>
                    </TouchableOpacity>
                  )}
                  {order.payment_status === 'pending' && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.paymentButton]}
                      onPress={() => retryPayment(order)}
                    >
                      <DollarSign size={20} color="#fff" style={styles.actionIcon} />
                      <Text style={styles.actionButtonText}>Complete Payment</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
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
    paddingTop: 60,
    backgroundColor: '#FF4747',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  filterText: {
    color: '#64748b',
    marginRight: 4,
    fontSize: 14,
    fontWeight: '500',
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
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusCompleted: {
    color: '#059669',
    backgroundColor: '#dcfce7',
  },
  statusPending: {
    color: '#d97706',
    backgroundColor: '#fef3c7',
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
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
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
    fontSize: 18,
    fontWeight: '700',
    color: '#FF4747',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#ffffff', // Changed from #f8fafc to white
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 160,
    elevation: 2, // Add elevation for Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  receiveButton: {
    backgroundColor: 'green',
  },
  paymentButton: {
    backgroundColor: '#FF4747', // Make sure this is distinct
  },
  actionButtonText: {
    color: '#ffffff', // Ensure text is white
    fontSize: 15,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.25)', // Add text shadow
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actionIcon: {
    marginRight: 8,
    color: '#ffffff', // Ensure icon is white
  },
  paymentStatus: {
    backgroundColor: '#fff2f2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginLeft: 8,
  },
  paymentStatusText: {
    color: '#FF4747', // Changed from green to match theme
    fontSize: 12,
    fontWeight: '500',
  },
});