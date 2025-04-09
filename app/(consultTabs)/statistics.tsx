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
          <View style={styles.iconContainer}>
            <Icon size={24} color="#2563eb" />
          </View>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardValue}>{value.toLocaleString()}</Text>
          <View
            style={[
              styles.growthBadge,
              isPositive ? styles.positiveGrowth : styles.negativeGrowth,
            ]}
          >
            {isPositive ? (
              <ChevronUp size={16} color="#059669" />
            ) : (
              <ChevronDown size={16} color="#dc2626" />
            )}
            <Text
              style={[
                styles.growthText,
                isPositive ? styles.positiveGrowthText : styles.negativeGrowthText,
              ]}
            >
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
        <Text style={styles.pageTitle}>Platform Statistics</Text>
        <Text style={styles.pageSubtitle}>Overview of our platform performance</Text>
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
          <View style={styles.activityItem}>
            <Calendar size={20} color="#64748b" />
            <Text style={styles.activityText}>
              New users joined this month: {statistics.recentActivity.newUsers}
            </Text>
          </View>
          <View style={styles.activityItem}>
            <Store size={20} color="#64748b" />
            <Text style={styles.activityText}>
              New shops registered this month: {statistics.recentActivity.newShops}
            </Text>
          </View>
          <View style={styles.activityItem}>
            <FileText size={20} color="#64748b" />
            <Text style={styles.activityText}>
              Posts created this month: {statistics.recentActivity.newPosts}
            </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  statisticsContainer: {
    flex: 1,
  },
  statisticsContent: {
    padding: 16,
  },
  statisticCard: {
    backgroundColor: '#ffffff',
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
    marginBottom: 12,
  },
  iconContainer: {
    backgroundColor: '#eff6ff',
    padding: 8,
    borderRadius: 8,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  positiveGrowth: {
    backgroundColor: '#dcfce7',
  },
  negativeGrowth: {
    backgroundColor: '#fee2e2',
  },
  growthText: {
    marginLeft: 4,
    fontWeight: '600',
  },
  positiveGrowthText: {
    color: '#059669',
  },
  negativeGrowthText: {
    color: '#dc2626',
  },
  detailsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
  },
  activityText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#64748b',
  },
});