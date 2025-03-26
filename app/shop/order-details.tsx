import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Package, MapPin, Phone, Clock, CheckCircle2, Truck } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';

export default function OrderDetails() {
  const { id } = useLocalSearchParams();

  // Mock order data - replace with actual API call
  const order = {
    id: 'ORD001',
    customerName: 'John Doe',
    date: '2024-02-20 14:30',
    status: 'processing',
    address: 'Karen, Nairobi',
    phone: '+254 712 345 678',
    items: [
      {
        id: '1',
        name: 'Layer Feed Premium',
        quantity: 2,
        price: 2500,
        total: 5000,
      },
      {
        id: '2',
        name: 'Automatic Feeder',
        quantity: 1,
        price: 10000,
        total: 10000,
      },
    ],
    subtotal: 15000,
    deliveryFee: 500,
    total: 15500,
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

  const handleUpdateStatus = (newStatus: string) => {
    // Implement status update logic
    console.log('Update status to:', newStatus);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.orderDate}>{order.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.status)}15` }]}>
          <Package size={16} color={getStatusColor(order.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <View style={styles.infoCard}>
          <Text style={styles.customerName}>{order.customerName}</Text>
          <View style={styles.infoRow}>
            <Phone size={16} color="#64748b" />
            <Text style={styles.infoText}>{order.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <MapPin size={16} color="#64748b" />
            <Text style={styles.infoText}>{order.address}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {order.items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>{item.quantity} x KES {item.price.toLocaleString()}</Text>
            </View>
            <Text style={styles.itemTotal}>KES {item.total.toLocaleString()}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>KES {order.subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>KES {order.deliveryFee.toLocaleString()}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>KES {order.total.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Update Status</Text>
        <View style={styles.actionButtons}>
          <Button
            variant="outline"
            onPress={() => handleUpdateStatus('processing')}
            disabled={order.status !== 'pending'}>
            <View style={styles.buttonContent}>
              <Package size={20} color="#2563eb" />
              <Text style={styles.buttonText}>Processing</Text>
            </View>
          </Button>
          <Button
            variant="outline"
            onPress={() => handleUpdateStatus('shipped')}
            disabled={order.status !== 'processing'}>
            <View style={styles.buttonContent}>
              <Truck size={20} color="#2563eb" />
              <Text style={styles.buttonText}>Ship Order</Text>
            </View>
          </Button>
          <Button
            onPress={() => handleUpdateStatus('delivered')}
            disabled={order.status !== 'shipped'}>
            <View style={styles.buttonContent}>
              <CheckCircle2 size={20} color="#ffffff" />
              <Text style={[styles.buttonText, styles.whiteText]}>Mark as Delivered</Text>
            </View>
          </Button>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  orderId: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  orderDate: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  }
});