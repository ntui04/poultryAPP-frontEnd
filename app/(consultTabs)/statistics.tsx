import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { 
  UserCheck, 
  Store, 
  FileText, 
  Calendar, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react-native';
import { statisticsApi } from '../services/api';

interface Statistics {
  totalUsers: number;
  totalShops: number;
  totalPosts: number;
  monthlyGrowth: {
    users: {
      value: number;
      isPositive: boolean;
    };
    shops: {
      value: number;
      isPositive: boolean;
    };
    posts: {
      value: number;
      isPositive: boolean;
    };
  };
  recentActivity: {
    newUsers: number;
    newShops: number;
    newPosts: number;
  };
}

export default function Statistics() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    try {
      setError(null);
      const [overview, growth, activity] = await Promise.all([
        statisticsApi.getOverview(),
        statisticsApi.getMonthlyGrowth(),
        statisticsApi.getRecentActivity(),
      ]);

      setStatistics({
        ...overview.data,
        monthlyGrowth: {
          users: growth.data?.users || { value: 0, isPositive: true },
          shops: growth.data?.shops || { value: 0, isPositive: true },
          posts: growth.data?.posts || { value: 0, isPositive: true },
        },
        recentActivity: activity.data || {
          newUsers: 0,
          newShops: 0,
          newPosts: 0,
        },
      });
    } catch (err: any) {
      console.error('Error fetching statistics:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStatistics();
    setRefreshing(false);
  };

  const StatisticCard = ({ icon: Icon, title, value, growth }) => {
    const isPositive = growth?.isPositive ?? true;
    const growthValue = growth?.value ?? 0;

    return (
      <View style={styles.statisticCard}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: '#fff2f2' }]}>
            <Icon size={24} color="#FF4747" />
          </View>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardValue}>{value.toLocaleString()}</Text>
          <View style={[styles.growthBadge, isPositive ? styles.positiveGrowth : styles.negativeGrowth]}>
            {isPositive ? (
              <ChevronUp size={16} color="#059669" />
            ) : (
              <ChevronDown size={16} color="#dc2626" />
            )}
            <Text style={[styles.growthText, isPositive ? styles.positiveGrowthText : styles.negativeGrowthText]}>
              {growthValue}%
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Statistics</Text>
        <Text style={styles.pageSubtitle}>Platform performance overview</Text>
      </View>

      <ScrollView 
        style={styles.statisticsContainer}
        contentContainerStyle={styles.statisticsContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
          <View style={styles.activityList}>
            {/*
              { icon: Calendar, text: `${statistics?.recentActivity.newUsers} new users this month` },
              { icon: Store, text: `${statistics?.recentActivity.newShops} new shops registered` },
              { icon: FileText, text: `${statistics?.recentActivity.newPosts} new posts created` }
            */}
            {/*
              .map((item, index) => (
                <View key={index} style={styles.activityItem}>
                  <View style={styles.activityIconContainer}>
                    <item.icon size={20} color="#FF4747" />
                  </View>
                  <Text style={styles.activityText}>{item.text}</Text>
                </View>
              ))
            */}
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
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#FF4747',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statisticsContainer: {
    flex: 1,
  },
  statisticsContent: {
    padding: 24,
    paddingTop: 12,
  },
  statisticCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1f2937',
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  positiveGrowth: {
    backgroundColor: '#dcfce7',
  },
  negativeGrowth: {
    backgroundColor: '#fee2e2',
  },
  growthText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '700',
  },
  positiveGrowthText: {
    color: '#059669',
  },
  negativeGrowthText: {
    color: '#dc2626',
  },
  detailsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailsSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
  },
  activityIconContainer: {
    backgroundColor: '#fff2f2',
    padding: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  activityText: {
    flex: 1,
    fontSize: 15,
    color: '#1f2937',
    fontWeight: '500',
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
    padding: 24,
  },
  errorText: {
    color: '#FF4747',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
});