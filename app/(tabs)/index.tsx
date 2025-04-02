import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/auth';
import {
  Bell,
  MapPin,
  TrendingUp,
  ThermometerSun,
  Users,
  Calendar,
} from 'lucide-react-native';

export default function Home() {
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const farmStats = {
    totalBirds: 2500,
    mortality: 0.5,
    avgWeight: 1.8,
    feedConsumption: 450,
  };

  const upcomingTasks = [
    {
      id: '1',
      title: 'Vaccination Schedule',
      date: 'Today, 2:30 PM',
      type: 'health',
      description: 'Newcastle Disease vaccination for Batch A',
    },
    {
      id: '2',
      title: 'Feed Delivery',
      date: 'Tomorrow, 9:00 AM',
      type: 'feed',
      description: 'Layer feed delivery from Farm Supply Co.',
    },
  ];

  const weatherInfo = {
    temperature: 24,
    humidity: 65,
    condition: 'Partly Cloudy',
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Implement refresh logic here
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {user?.lastname ? `Welcome back, ${user.lastname}` : 'Welcome back!'} {user?.firstname}
          </Text>

          <View style={styles.location}>
            <MapPin size={16} color="#64748b" />
            <Text style={styles.locationText}>Mbeya, Tanzania</Text>
          </View>
        </View>
        <Pressable
          style={styles.notificationButton}
          // onPress={() => router.push('/notifications')}
        >
          <Bell size={24} color="#1f2937" />
          <View style={styles.notificationBadge} />
        </Pressable>

        {/* <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push('/(tabs)/profile/profile')}
            >
              profile
            </TouchableOpacity> */}
      </View>

      {/* Weather Card */}
      <View style={styles.weatherCard}>
        <View style={styles.weatherInfo}>
          <ThermometerSun size={24} color="#2563eb" />
          <View style={styles.weatherDetails}>
            <Text style={styles.weatherTemp}>{weatherInfo.temperature}°C</Text>
            <Text style={styles.weatherDesc}>{weatherInfo.condition}</Text>
          </View>
        </View>
        <Text style={styles.weatherHumidity}>
          Humidity: {weatherInfo.humidity}%
        </Text>
      </View>

      {/* Farm Statistics */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Farm Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Users size={20} color="#2563eb" />
            <Text style={styles.statValue}>{farmStats.totalBirds}</Text>
            <Text style={styles.statLabel}>Total Birds</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={20} color="#2563eb" />
            <Text style={styles.statValue}>{farmStats.mortality}%</Text>
            <Text style={styles.statLabel}>Mortality Rate</Text>
          </View>
          <View style={styles.statCard}>
            <Calendar size={20} color="#2563eb" />
            <Text style={styles.statValue}>{farmStats.avgWeight}kg</Text>
            <Text style={styles.statLabel}>Avg Weight</Text>
          </View>
          <View style={styles.statCard}>
            <ThermometerSun size={20} color="#2563eb" />
            <Text style={styles.statValue}>{farmStats.feedConsumption}kg</Text>
            <Text style={styles.statLabel}>Feed Used</Text>
          </View>
        </View>
      </View>

      {/* Upcoming Tasks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Tasks</Text>
        {upcomingTasks.map((task) => (
          <Pressable
            key={task.id}
            style={styles.taskCard}
            // onPress={() => router.push(`/task/${task.id}`)}
          >
            <View style={styles.taskHeader}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskDate}>{task.date}</Text>
            </View>
            <Text style={styles.taskDescription}>{task.description}</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  greeting: {
    marginTop: 15,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    marginLeft: 4,
    color: '#64748b',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  weatherCard: {
    margin: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherDetails: {
    marginLeft: 12,
  },
  weatherTemp: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
  },
  weatherDesc: {
    fontSize: 14,
    color: '#64748b',
  },
  weatherHumidity: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748b',
  },
  statsContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    padding: 24,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  taskDate: {
    fontSize: 14,
    color: '#64748b',
  },
  taskDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
