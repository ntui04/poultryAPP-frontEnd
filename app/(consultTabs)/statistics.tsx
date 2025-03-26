import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { 
  UserCheck, 
  Store, 
  FileText, 
  Calendar, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react-native';

export default function Statistics() {
  const statistics = {
    totalUsers: 5234,
    totalShops: 1876,
    totalPosts: 423,
    monthlyGrowth: {
      users: {
        value: 12.5,
        isPositive: true
      },
      shops: {
        value: 8.3,
        isPositive: true
      },
      posts: {
        value: 5.7,
        isPositive: false
      }
    }
  };

  const StatisticCard = ({ icon: Icon, title, value, growth }) => (
    <View style={styles.statisticCard}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Icon size={24} color="#2563eb" />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardValue}>{value.toLocaleString()}</Text>
        <View style={[
          styles.growthBadge, 
          growth.isPositive ? styles.positiveGrowth : styles.negativeGrowth
        ]}>
          {growth.isPositive ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <Text style={styles.growthText}>{growth.value}%</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Platform Statistics</Text>
        <Text style={styles.pageSubtitle}>Overview of our platform performance</Text>
      </View>

      <ScrollView 
        style={styles.statisticsContainer}
        contentContainerStyle={styles.statisticsContent}
      >
        <StatisticCard 
          icon={UserCheck}
          title="Total Users"
          value={statistics.totalUsers}
          growth={statistics.monthlyGrowth.users}
        />

        <StatisticCard 
          icon={Store}
          title="Total Shops"
          value={statistics.totalShops}
          growth={statistics.monthlyGrowth.shops}
        />

        <StatisticCard 
          icon={FileText}
          title="Total Posts"
          value={statistics.totalPosts}
          growth={statistics.monthlyGrowth.posts}
        />

        <View style={styles.detailsSection}>
          <Text style={styles.detailsSectionTitle}>Recent Activity</Text>
          <View style={styles.activityItem}>
            <Calendar size={20} color="#64748b" />
            <Text style={styles.activityText}>New users joined this month: 652</Text>
          </View>
          <View style={styles.activityItem}>
            <Store size={20} color="#64748b" />
            <Text style={styles.activityText}>New shops registered this month: 247</Text>
          </View>
          <View style={styles.activityItem}>
            <FileText size={20} color="#64748b" />
            <Text style={styles.activityText}>Posts created this month: 87</Text>
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
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  statisticsContainer: {
    padding: 16,
  },
  statisticsContent: {
    paddingBottom: 32,
  },
  statisticCard: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    backgroundColor: '#e0f2fe',
    borderRadius: 50,
    padding: 10,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  positiveGrowth: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  negativeGrowth: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  growthText: {
    marginLeft: 4,
    fontWeight: '600',
  },
  detailsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  detailsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  activityText: {
    fontSize: 16,
    color: '#64748b',
  },
});