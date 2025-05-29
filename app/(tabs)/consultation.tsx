import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Pressable,
  ActivityIndicator 
} from 'react-native';
import { router } from 'expo-router';
import { Calendar, Clock, Star, MessageCircle, ShieldCheck } from 'lucide-react-native';
import { consultantsApi } from '../services/api';
import { mediaUrl } from '../services/api';

interface Consultant {
  id: string;
  name: string;  // Update this if API returns combined name
  firstname?: string;  // Add these if API returns separate names
  lastname?: string;
  specialization: string;
  experience: string;
  rating?: number;
  profile_image: string;
  education: string;
}

export default function Consultation() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = async () => {
    try {
      setLoading(true);
      const response = await consultantsApi.getAvailableConsultants();
      setConsultants(response.data);
    } catch (error) {
      console.error('Error fetching consultants:', error);
      setError('Failed to load consultants');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4747" />
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Veterinary Consultation</Text>
        <Text style={styles.subtitle}>
          Expert advice for your poultry health needs
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Consultants</Text>
        {consultants.map((consultant) => (
          <Pressable
            key={consultant.id}
            style={styles.vetCard}
            // onPress={() => router.push(`/book-consultation/${consultant.id}`)}
          >
            <Image 
              source={{ 
                uri: consultant.profile_image 
                  ? mediaUrl + consultant.profile_image 
                  : '../../assets/images/default-avatar.png'
              }} 
              style={styles.vetImage}
            />
            <View style={styles.vetInfo}>
              <View style={styles.vetHeader}>
                <Text style={styles.vetName}>
                  {consultant.name || `${consultant.firstname} ${consultant.lastname}`}
                </Text>
                {consultant.rating && (
                  <View style={styles.ratingContainer}>
                    <Star size={16} color="#FF4747" fill="#FF4747" />
                    <Text style={styles.rating}>{consultant.rating}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.specialization}>{consultant.specialization}</Text>
              <Text style={styles.experience}>{consultant.experience} experience</Text>
              <Text style={styles.education}>{consultant.education}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How it works</Text>
        <View style={styles.stepsContainer}>
          <View style={styles.stepCard}>
            <View style={styles.stepIconContainer}>
              <Calendar size={24} color="#FF4747" />
            </View>
            <Text style={styles.stepTitle}>Book Appointment</Text>
            <Text style={styles.stepDescription}>
              Schedule a time that works for you
            </Text>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepIconContainer}>
              <MessageCircle size={24} color="#FF4747" />
            </View>
            <Text style={styles.stepTitle}>Consult Online</Text>
            <Text style={styles.stepDescription}>
              Connect with your vet via video call
            </Text>
          </View>

          <View style={styles.stepCard}>
            <View style={styles.stepIconContainer}>
              <ShieldCheck size={24} color="#FF4747" />
            </View>
            <Text style={styles.stepTitle}>Get Care Plan</Text>
            <Text style={styles.stepDescription}>
              Receive personalized treatment plan
            </Text>
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
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#FF4747',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  vetCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  vetImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  vetInfo: {
    flex: 1,
    marginLeft: 16,
  },
  vetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  vetName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#FF4747',
  },
  specialization: {
    fontSize: 14,
    color: '#FF4747',
    fontWeight: '500',
    marginTop: 4,
  },
  experience: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  consultationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  availableTag: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  availableText: {
    fontSize: 13,
    color: '#166534',
    fontWeight: '600',
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  stepCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF4747',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  education: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
});