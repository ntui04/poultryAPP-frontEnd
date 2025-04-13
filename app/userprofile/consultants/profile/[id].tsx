import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  ActivityIndicator, 
  Pressable 
} from 'react-native';
import { Star, Phone, MapPin, GraduationCap, Briefcase, Clock } from 'lucide-react-native';
import { consultantsApi } from '../../../services/api';

export default function ConsultantProfile() {
  const { id } = useLocalSearchParams();
  const [consultant, setConsultant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mediaUrl = 'http://192.168.82.32:8000/storage/';


  const fetchConsultant = async () => {
    try {
      const response = await consultantsApi.getOne(id as string);
      setConsultant(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultant();
  }, []);

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

  if (!consultant) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri:mediaUrl + consultant.image }} style={styles.profileImage} />

      <Text style={styles.name}>{consultant.name}</Text>
      <Text style={styles.specialization}>{consultant.specialization}</Text>

      <View style={styles.row}>
        <Star size={16} color="#eab308" fill="#eab308" />
        <Text style={styles.rating}>{consultant.rating} ({consultant.reviews} reviews)</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Phone size={18} color="#2563eb" />
          <Text style={styles.infoText}>+255 {consultant.number}</Text>
        </View>

        <View style={styles.infoItem}>
          <MapPin size={18} color="#2563eb" />
          <Text style={styles.infoText}>{consultant.location || 'Location not set'}</Text>
        </View>

        <View style={styles.infoItem}>
          <Briefcase size={18} color="#2563eb" />
          <Text style={styles.infoText}>{consultant.experience}</Text>
        </View>

        <View style={styles.infoItem}>
          <GraduationCap size={18} color="#2563eb" />
          <Text style={styles.infoText}>{consultant.education}</Text>
        </View>

        <View style={styles.infoItem}>
          <Clock size={18} color="#2563eb" />
          <Text style={styles.infoText}>Next Available: {consultant.nextAvailable}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
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
    fontSize: 16,
    color: '#dc2626',
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  specialization: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 10,
  },
  rating: {
    fontSize: 14,
    color: '#475569',
    marginLeft: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoSection: {
    width: '100%',
    marginTop: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#334155',
  },
});
