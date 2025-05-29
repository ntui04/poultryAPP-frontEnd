import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { mediaUrl } from '../app/services/api';

interface OrderProps {
  order: {
    id: number;
    status_text: string;
    status_color: string;
    payment_status: string;
    quantity: number;
    total_price: number;
    product: {
      product_name: string;
      image: string;
    };
  };
  onRetryPayment: (order: any) => void;
}

export const OrderCard = ({ order, onRetryPayment }: OrderProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.orderNumber}>Order #{order.id}</Text>
        <Text style={[styles.status, { color: order.status_color }]}>
          {order.status_text}
        </Text>
      </View>

      {order.payment_status === 'pending' && (
        <View style={styles.paymentAlert}>
          <Text style={styles.alertText}>Payment Required</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => onRetryPayment(order)}
          >
            <Text style={styles.retryText}>Retry Payment</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.productInfo}>
        <Image 
          source={{ uri: mediaUrl + order.product.image }} 
          style={styles.productImage} 
        />
        <View style={styles.details}>
          <Text style={styles.productName}>{order.product.product_name}</Text>
          <Text style={styles.quantity}>Quantity: {order.quantity}</Text>
          <Text style={styles.price}>Total: TSh {order.total_price.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  paymentAlert: {
    backgroundColor: '#fff2f2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertText: {
    color: '#FF4747',
    fontSize: 14,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#FF4747',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4747',
  },
});

export default OrderCard;