import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { X, ShoppingCart } from 'lucide-react-native';
import { mediaUrl } from '@/app/services/api';

const formatPrice = (price: number | string | undefined): string => {
  if (!price) return '0.00';
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numPrice.toFixed(2);
};

const ProductDetailsModal = ({ 
  visible, 
  product, 
  onClose, 
  onBuy, 
  quantity, 
  onUpdateQuantity,
  loading 
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#64748b" />
          </TouchableOpacity>

          <ScrollView style={styles.modalScroll}>
            <Image
              source={{ uri: mediaUrl + product?.image }}
              style={styles.modalImage}
              resizeMode="contain"
            />
            
            <View style={styles.modalInfo}>
              <Text style={styles.modalTitle}>{product?.product_name}</Text>
              <Text style={styles.modalPrice}>
                TSH {formatPrice(product?.price)}
              </Text>
              <Text style={styles.modalDescription}>{product?.description}</Text>
              
              <View style={styles.stockInfo}>
                <Text style={styles.stockLabel}>Available Stock:</Text>
                <Text style={styles.stockValue}>{product?.stock_quantity}</Text>
              </View>

              {/* Quantity selector and Buy button */}
              <View style={styles.buySection}>
                <View style={styles.quantitySelector}>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => onUpdateQuantity(-1)}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  
                  <Text style={styles.quantityText}>{quantity}</Text>
                  
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => onUpdateQuantity(1)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={[styles.buyButton, loading && styles.buyButtonDisabled]}
                  onPress={onBuy}
                  disabled={loading}
                >
                  <ShoppingCart size={20} color="#ffffff" style={styles.buttonIcon} />
                  <Text style={styles.buyButtonText}>
                    {loading ? 'Processing...' : 'Buy Now'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    padding: 8,
  },
  modalScroll: {
    maxHeight: '100%',
  },
  modalImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f8fafc',
  },
  modalInfo: {
    padding: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  modalPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 16,
  },
  modalDescription: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
    marginBottom: 16,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  stockLabel: {
    fontSize: 16,
    color: '#64748b',
    marginRight: 8,
  },
  stockValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  buySection: {
    marginTop: 16,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  quantityButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    color: '#1f2937',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 24,
  },
  buyButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  buyButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ProductDetailsModal;