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
import { mediaUrl } from '../../../services/api'; // Adjust the import path as necessary

export default function ConsultantProfile() {
  const { id } = useLocalSearchParams();
  const [consultant, setConsultant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const mediaUrl = 'http://192.168.82.32:8000/storage/'


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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: mediaUrl + consultant.image }} 
          style={styles.coverImage} 
          blurRadius={30}
        />
        <View style={styles.overlay} />
        
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: mediaUrl + consultant.image }} 
            style={styles.profileImage} 
          />
          <View style={styles.basicInfo}>
            <Text style={styles.name}>{consultant.name}</Text>
            <Text style={styles.specialization}>{consultant.specialization}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FF4747" fill="#FF4747" />
              <Text style={styles.rating}>
                {consultant.rating} ({consultant.reviews} reviews)
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Phone size={20} color="#FF4747" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoText}>+255 {consultant.number}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <MapPin size={20} color="#FF4747" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoText}>{consultant.location || 'Location not set'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Professional Details</Text>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Briefcase size={20} color="#FF4747" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Experience</Text>
              <Text style={styles.infoText}>{consultant.experience}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <GraduationCap size={20} color="#FF4747" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Education</Text>
              <Text style={styles.infoText}>{consultant.education}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.iconContainer}>
              <Clock size={20} color="#FF4747" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Next Available</Text>
              <Text style={styles.infoText}>{consultant.nextAvailable}</Text>
            </View>
          </View>
        </View>

       
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
    height: 300,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  profileSection: {
    padding: 24,
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  basicInfo: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  specialization: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  rating: {
    color: '#ffffff',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 24,
    paddingTop: 16,
  },
  card: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 2,
  },
  infoText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  bookButton: {
    backgroundColor: '#FF4747',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#FF4747',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
