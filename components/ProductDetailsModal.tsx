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
  SafeAreaView,
} from 'react-native';
import { X, ShoppingCart, Heart, Share2 } from 'lucide-react-native';
import { mediaUrl } from '@/app/services/api';

const formatPrice = (price: number | string | undefined): string => {
  if (!price) return '0.00';
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numPrice.toFixed(2);
};

type ProductDetailsModalProps = {
  visible: boolean;
  product: {
    image?: string;
    product_name?: string;
    price?: number | string;
    description?: string;
    stock_quantity?: number | string;
    [key: string]: any;
  } | null;
  onClose: () => void;
  onBuy: () => void;
  quantity: number;
  onUpdateQuantity: (delta: number) => void;
  loading: boolean;
};

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
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
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Share2 size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Heart size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.modalScroll} bounces={false}>
          <View style={styles.imageContainer}>
            <Image
              source={{ 
                uri: mediaUrl + product?.image,
                cache: 'reload',
                headers: { 'Cache-Control': 'no-cache' }
              }}
              style={styles.modalImage}
              resizeMode="contain"
              fadeDuration={0}
            />
          </View>
          
          <View style={styles.modalInfo}>
            <View style={styles.priceSection}>
              <Text style={styles.modalPrice}>
                TSH {formatPrice(product?.price)}
              </Text>
              {product?.stock_quantity && Number(product.stock_quantity) < 10 && (
                <Text style={styles.lowStock}>
                  Only {product.stock_quantity} left!
                </Text>
              )}
            </View>

            <Text style={styles.modalTitle}>{product?.product_name}</Text>
            
            <View style={styles.statsSection}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{product?.stock_quantity}</Text>
                <Text style={styles.statLabel}>In Stock</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>4.8</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>100+</Text>
                <Text style={styles.statLabel}>Sold</Text>
              </View>
            </View>

            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.modalDescription}>{product?.description}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
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
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 8,
  },
  modalScroll: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1, // Makes container square
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
  },
  modalInfo: {
    padding: 16,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  modalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4747',
  },
  lowStock: {
    marginLeft: 8,
    color: '#FF4747',
    fontSize: 14,
  },
  modalTitle: {
    fontSize: 18,
    color: '#1f2937',
    marginBottom: 16,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#e2e8f0',
  },
  descriptionSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#fff',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 4,
    marginRight: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#1f2937',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#FF4747',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  buyButtonDisabled: {
    backgroundColor: '#fca5a5',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetailsModal;