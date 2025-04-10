import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Pressable, 
  TextInput,
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { router } from 'expo-router';
import { Search, Star, Clock, PlusCircle } from 'lucide-react-native';
import { consultantsApi } from '../services/api';

interface Consultant {
  id: string;
  name: string;
  specialization: string;
  image: string;
  rating: number;
  reviews: number;
  experience: string;
  education: string;
  nextAvailable: string;
}

export default function ConsultantsHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConsultants = async () => {
    try {
      setError(null);
      const response = await consultantsApi.getAll();
      setConsultants(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch consultants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultants();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchConsultants();
    setRefreshing(false);
  };

  const filteredConsultants = consultants.filter(consultant =>
    consultant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    consultant.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Pressable style={styles.retryButton} onPress={fetchConsultants}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.pageTitle}>Veterinary Consultants</Text>
          <Pressable 
            style={styles.addConsultantButton}
            onPress={() => router.push('/consultants/add')}
          >
            <PlusCircle size={24} color="#2563eb" />
            <Text style={styles.addConsultantText}>Add Consultant</Text>
          </Pressable>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search veterinarians..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      <ScrollView 
        style={styles.consultantList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredConsultants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No consultants found</Text>
          </View>
        ) : (
          filteredConsultants.map((consultant) => (
            <Pressable
              key={consultant.id}
              style={styles.consultantCard}
              onPress={() => router.push(`/userprofile/consultants/profile/${consultant.id}`)}

            >
              <View style={styles.cardHeader}>
                <Image source={{ uri: consultant.image }} style={styles.consultantImage} />
                <View style={styles.headerInfo}>
                  <Text style={styles.consultantName}>{consultant.name}</Text>
                  <Text style={styles.specialization}>{consultant.specialization}</Text>
                  <View style={styles.ratingContainer}>
                    <Star size={16} color="#eab308" fill="#eab308" />
                    <Text style={styles.rating}>{consultant.rating}</Text>
                    <Text style={styles.reviews}>({consultant.reviews} reviews)</Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Experience</Text>
                    <Text style={styles.infoValue}>{consultant.experience}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Education</Text>
                    <Text style={styles.infoValue}>{consultant.education}</Text>
                  </View>
                </View>

                <View style={styles.availabilityContainer}>
                  <View style={styles.availabilityInfo}>
                    <Clock size={16} color="#64748b" />
                    <Text style={styles.nextAvailable}>Next available: {consultant.nextAvailable}</Text>
                  </View>
                  <Pressable
                    style={styles.viewProfileButton}
                    onPress={() => router.push(`/consultants/profile/${consultant.id}`)}
                  >
                    <Text style={styles.viewProfileButtonText}>View Profile</Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          ))
        )}
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
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
  },
  addConsultantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addConsultantText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  consultantList: {
    padding: 16,
  },
  consultantCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  consultantImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  consultantName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  specialization: {
    fontSize: 14,
    color: '#2563eb',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  reviews: {
    fontSize: 14,
    color: '#64748b',
  },
  cardContent: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  availabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nextAvailable: {
    fontSize: 14,
    color: '#64748b',
  },
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewProfileButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
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
    color: '#ef4444',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});