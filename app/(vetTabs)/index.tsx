import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList 
} from 'react-native';
import { 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Package, 
  AlertCircle,
  ChevronRight
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AgrovetDashboard() {
  // Sample data
  const [upcomingVisits, setUpcomingVisits] = useState([
    { id: '1', clientName: 'John Smith Farm', date: '2025-03-25', time: '9:00 AM', type: 'Vaccination' },
    { id: '2', clientName: 'Green Acres', date: '2025-03-25', time: '2:00 PM', type: 'Consultation' },
    { id: '3', clientName: 'Mountain Poultry', date: '2025-03-26', time: '10:30 AM', type: 'Health Check' },
  ]);
  
  const [lowStockItems, setLowStockItems] = useState([
    { id: '1', name: 'Amoxicillin 250mg', quantity: 5, threshold: 10 },
    { id: '2', name: 'Coccidiosis Vaccine', quantity: 3, threshold: 15 },
    { id: '3', name: 'Vitamin B Complex', quantity: 8, threshold: 20 },
  ]);

  // Render helper functions
  const renderVisitItem = ({ item }) => (
    <TouchableOpacity style={styles.visitItem}>
      <View style={styles.visitLeftContent}>
        <View style={styles.visitDateContainer}>
          <Calendar size={16} color="#15803d" />
          <Text style={styles.visitDate}>{item.date}</Text>
        </View>
        <View style={styles.visitTimeContainer}>
          <Clock size={16} color="#15803d" />
          <Text style={styles.visitTime}>{item.time}</Text>
        </View>
      </View>
      <View style={styles.visitMiddleContent}>
        <Text style={styles.visitClientName}>{item.clientName}</Text>
        <Text style={styles.visitType}>{item.type}</Text>
      </View>
      <ChevronRight size={20} color="#64748b" />
    </TouchableOpacity>
  );

  const renderLowStockItem = ({ item }) => (
    <TouchableOpacity style={styles.stockItem}>
      <View style={styles.stockInfo}>
        <Text style={styles.stockName}>{item.name}</Text>
        <Text style={styles.stockQuantity}>Qty: <Text style={styles.stockQuantityValue}>{item.quantity}</Text></Text>
      </View>
      <View style={styles.stockAlert}>
        <AlertCircle size={16} color="#ef4444" />
        <Text style={styles.stockAlertText}>Low Stock</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.name}>Dr. Sarah Johnson</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, styles.clientsIcon]}>
                <Users size={20} color="#ffffff" />
              </View>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Active Clients</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIcon, styles.appointmentsIcon]}>
                <Calendar size={20} color="#ffffff" />
              </View>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Visits This Week</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, styles.productsIcon]}>
                <Package size={20} color="#ffffff" />
              </View>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Low Stock Items</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIcon, styles.salesIcon]}>
                <DollarSign size={20} color="#ffffff" />
              </View>
              <Text style={styles.statValue}>$2,850</Text>
              <Text style={styles.statLabel}>Sales This Month</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Visits Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Visits</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={upcomingVisits}
            renderItem={renderVisitItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>

        {/* Low Stock Alert Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Low Stock Alerts</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={lowStockItems}
            renderItem={renderLowStockItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    backgroundColor: '#15803d',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
  },
  statsContainer: {
    padding: 16,
    marginTop: -20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  clientsIcon: {
    backgroundColor: '#2563eb',
  },
  appointmentsIcon: {
    backgroundColor: '#0ea5e9',
  },
  productsIcon: {
    backgroundColor: '#f59e0b',
  },
  salesIcon: {
    backgroundColor: '#10b981',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  sectionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  seeAllText: {
    fontSize: 14,
    color: '#15803d',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  visitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  visitLeftContent: {
    marginRight: 12,
  },
  visitDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  visitTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visitDate: {
    marginLeft: 4,
    fontSize: 14,
    color: '#64748b',
  },
  visitTime: {
    marginLeft: 4,
    fontSize: 14,
    color: '#64748b',
  },
  visitMiddleContent: {
    flex: 1,
  },
  visitClientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  visitType: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  stockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  stockInfo: {
    flex: 1,
  },
  stockName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  stockQuantity: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  stockQuantityValue: {
    color: '#ef4444',
    fontWeight: '600',
  },
  stockAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  stockAlertText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '500',
  },
});