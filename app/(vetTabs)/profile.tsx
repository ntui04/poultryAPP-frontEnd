import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const ShopProfileScreen = () => {
  // Demo data for the shop
  const shop = {
    id: 1,
    name: "Green Fields Agro-Vet",
    owner: "John Doe",
    contact: "+254712345678",
    workingHours: "8:00 AM - 6:00 PM",
    products: [
      { id: 1, name: "Poultry Feed", price: 1500, category: "Feed" },
      { id: 2, name: "Vaccines", price: 500, category: "Medicines" },
      { id: 3, name: "Day-Old Chicks", price: 200, category: "Chicks" },
      { id: 4, name: "Feeders", price: 1200, category: "Equipment" },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.shopName}>{shop.name}</Text>
      <Text style={styles.shopOwner}>Owner: {shop.owner}</Text>
      <Text style={styles.shopContact}>Contact: {shop.contact}</Text>
      <Text style={styles.shopHours}>Working Hours: {shop.workingHours}</Text>
      
      <Text style={styles.sectionTitle}>Products</Text>
      <FlatList
        data={shop.products}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>Ksh {item.price}</Text>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  shopName: {
    marginTop: 30,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  shopOwner: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
  },
  shopContact: {
    fontSize: 16,
    color: '#2563eb',
    marginTop: 8,
  },
  shopHours: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  productItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productName: {
    fontSize: 16,
    color: '#1f2937',
  },
  productPrice: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
});

export default ShopProfileScreen;