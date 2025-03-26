import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react-native';

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered'>('all');

  const orders = [
    {
      id: 'ORD001',
      customerName: 'John Doe',
      date: '2024-02-20',
      total: 15000,
      items: 3,
      status: 'pending',
      address: 'Karen, Nairobi',
      phone: '+254 712 345 678',
    },
    {
      id: 'ORD002',
      customerName: 'Jane Smith',
      date: '2024-02-19',
      total: 8500,
      items: 2,
      status: 'processing',
      address: 'Westlands, Nairobi',
      phone: '+254 723 456 789',
    },
    {
      id: 'ORD003',
      customerName: 'Mike Johnson',
      date: '2024-02-18',
      total: 22000,
      items: 5,
      status: 'shipped',
      address: 'Kilimani, Nairobi',
      phone: '+254 734 567 890',
    },
    {
      id: 'ORD004',
      customerName: 'Sarah Williams',
      date: '2024-02-17',
      total: 12500,
      items: 4,
      status: 'delivered',
      address: 'Lavington, Nairobi',
      phone: '+254 745 678 901',
    },
  ];

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
        return <Clock size={16} color={getStatusColor(status)} />;
      case 'processing':
        return <Package size={16} color={getStatusColor(status)} />;
      case 'shipped':
        return <Truck size={16} color={getStatusColor(status)} />;
      case 'delivered':
        return <CheckCircle2 size={16} color={getStatusColor(status)} />;
      default:
        return <AlertCircle size={16} color={getStatusColor(status)} />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search orders..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        <Pressable
          style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('all')}>
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
            All Orders
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterButton, selectedFilter === 'pending' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('pending')}>
          <Text style={[styles.filterText, selectedFilter === 'pending' && styles.filterTextActive]}>
            Pending
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterButton, selectedFilter === 'processing' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('processing')}>
          <Text style={[styles.filterText, selectedFilter === 'processing' && styles.filterTextActive]}>
            Processing
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterButton, selectedFilter === 'shipped' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('shipped')}>
          <Text style={[styles.filterText, selectedFilter === 'shipped' && styles.filterTextActive]}>
            Shipped
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterButton, selectedFilter === 'delivered' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('delivered')}>
          <Text style={[styles.filterText, selectedFilter === 'delivered' && styles.filterTextActive]}>
            Delivered
          </Text>
        </Pressable>
      </ScrollView>

      <ScrollView style={styles.orderList}>
        {filteredOrders.map((order) => (
          <Pressable
            key={order.id}
            style={styles.orderCard}
            onPress={() => router.push({
              pathname: '/shop/order-details',
              params: { id: order.id }
            })}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.status)}15` }]}>
                {getStatusIcon(order.status)}
                <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{order.customerName}</Text>
              <Text style={styles.customerDetails}>{order.phone}</Text>
              <Text style={styles.customerDetails}>{order.address}</Text>
            </View>

            <View style={styles.orderFooter}>
              <Text style={styles.itemCount}>{order.items} items</Text>
              <Text style={styles.orderTotal}>KES {order.total.toLocaleString()}</Text>
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
  filterContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
  },
  filterText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  orderList: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
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
  customerInfo: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  customerDetails: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
  },
  itemCount: {
    fontSize: 14,
    color: '#64748b',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
});