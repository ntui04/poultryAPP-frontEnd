import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ArrowLeft,
  Package,
  Truck,
  CircleCheck,
  Clock,
  User,
  Mail,
  Phone,
  DollarSign,
  Package2,
} from 'lucide-react-native';
import { ordersApi } from '../../services/api';

interface Order {
  id: number;
  user: {
    firstname: string;
    lastname: string;
    phone_number?: string;
  };
  product: {
    product_name: string;
    price: number;
    image: string;
  };
  quantity: number;
  total_price: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  created_at: string;
}

export default function OrderDetails() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaUrl = 'http://192.168.90.32:8000/storage/';

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setError(null);
      const response = await ordersApi.getOne(Number(id));
      setOrder(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    try {
      setUpdating(true);
      await ordersApi.updateStatus(Number(id), newStatus);
      await fetchOrder(); // Refresh order data
      Alert.alert('Success', 'Order status updated successfully');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'processing':
        return '#3b82f6';
      case 'shipped':
        return '#8b5cf6';
      case 'delivered':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} color={getStatusColor(status)} />;
      case 'processing':
        return <Package size={20} color={getStatusColor(status)} />;
      case 'shipped':
        return <Truck size={20} color={getStatusColor(status)} />;
      case 'delivered':
        return <CircleCheck size={20} color={getStatusColor(status)} />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Order not found'}</Text>
        <Pressable style={styles.retryButton} onPress={fetchOrder}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.status)}15` }]}>
              {getStatusIcon(order.status)}
              <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Text>
            </View>
            <Text style={styles.dateText}>{formatDate(order.created_at)}</Text>
          </View>

          <View style={styles.statusActions}>
            {['pending', 'processing', 'shipped', 'delivered'].map((status) => (
              <Pressable
                key={status}
                style={[
                  styles.statusButton,
                  order.status === status && styles.statusButtonActive,
                  { opacity: updating ? 0.5 : 1 },
                ]}
                onPress={() => updateOrderStatus(status)}
                disabled={updating || order.status === status}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    order.status === status && styles.statusButtonTextActive,
                  ]}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.infoRow}>
            <User size={20} color="#64748b" />
            <Text style={styles.infoText}>{order.user.lastname}</Text>
          </View>
          <View style={styles.infoRow}>
            <Mail size={20} color="#64748b" />
            <Text style={styles.infoText}>{order.user.firstname}</Text>
          </View>
          {order.user.phone_number && (
            <View style={styles.infoRow}>
              <Phone size={20} color="#64748b" />
              <Text style={styles.infoText}>{order.user.phone_number}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Details</Text>
          <View style={styles.productCard}>
            <Image
              source={{ uri: mediaUrl + order.product.image }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{order.product.product_name}</Text>
              <View style={styles.productMeta}>
                <View style={styles.infoRow}>
                  <Package2 size={16} color="#64748b" />
                  <Text style={styles.metaText}>Quantity: {order.quantity}</Text>
                </View>
                <View style={styles.infoRow}>
                  <DollarSign size={16} color="#64748b" />
                  <Text style={styles.metaText}>Unit Price: ${order.product.price}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              ${(order.product.price * order.quantity).toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>$0.00</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${order.total_price}</Text>
          </View>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 8,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 14,
    color: '#64748b',
  },
  statusActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#2563eb',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  statusButtonTextActive: {
    color: '#ffffff',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#1e293b',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    overflow: 'hidden',
  },
  productImage: {
    width: 100,
    height: 100,
  },
  productInfo: {
    flex: 1,
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 8,
  },
  productMeta: {
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 16,
    color: '#1e293b',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563eb',
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