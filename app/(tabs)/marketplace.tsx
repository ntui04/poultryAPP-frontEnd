import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Search, Filter } from 'lucide-react-native';

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: '1', name: 'Feed', icon: '🌾' },
    { id: '2', name: 'Medicine', icon: '💊' },
    { id: '3', name: 'Equipment', icon: '🔧' },
    { id: '4', name: 'Chicks', icon: '🐥' },
  ];

  const products = [
    {
      id: '1',
      name: 'Layer Feed Premium',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1620574387735-3624d75b2dbc',
      shop: 'Farm Supply Co.',
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Automatic Feeder',
      price: 5000,
      image: 'https://images.unsplash.com/photo-1595508064774-5ff825ff0f81',
      shop: 'Poultry Essentials',
      rating: 4.6,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Pressable style={styles.filterButton}>
          <Filter size={20} color="#1f2937" />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categories}>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={styles.categoryButton}
            onPress={() => router.push(`/category/${category.id}`)}>
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={styles.categoryName}>{category.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.productsGrid}>
        {products.map((product) => (
          <Pressable
            key={product.id}
            style={styles.productCard}
            onPress={() => router.push(`/product/${product.id}`)}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productShop}>{product.shop}</Text>
              <View style={styles.productMeta}>
                <Text style={styles.productPrice}>KES {product.price}</Text>
                <Text style={styles.productRating}>★ {product.rating}</Text>
              </View>
            </View>
          </Pressable>
        ))}
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
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 10
  },
  searchContainer: {
    marginTop: 15,
    
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  filterButton: {
    padding: 8,
  },
  categories: {
    padding: 16,
    marginTop: 15,

  },
  categoryButton: {
    alignItems: 'center',
    marginRight: 24,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    color: '#1f2937',
  },
  productsGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  productShop: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  productRating: {
    fontSize: 14,
    color: '#eab308',
    fontWeight: '500',
  },
});