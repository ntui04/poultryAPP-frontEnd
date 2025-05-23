import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Calendar, Clock, Star, MessageCircle, ShieldCheck } from 'lucide-react-native';

export default function Consultation() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const veterinarians = [
    {
      id: '1',
      name: 'Dr. Sarah Wilson',
      specialization: 'Poultry Health',
      experience: '8 years',
      rating: 4.8,
      price: 2500,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2',
      available: true,
    },
    {
      id: '2',
      name: 'Dr. John Carter',
      specialization: 'Avian Medicine',
      experience: '12 years',
      rating: 4.9,
      price: 3000,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d',
      available: true,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Veterinary Consultation</Text>
        <Text style={styles.subtitle}>
          Expert advice for your poultry health needs
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Veterinarians</Text>
        {veterinarians.map((vet) => (
          <Pressable
            key={vet.id}
            style={styles.vetCard}
            onPress={() => router.push(`/book-consultation/${vet.id}`)}
          >
            <Image source={{ uri: vet.image }} style={styles.vetImage} />
            <View style={styles.vetInfo}>
              <View style={styles.vetHeader}>
                <Text style={styles.vetName}>{vet.name}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FF4747" fill="#FF4747" />
                  <Text style={styles.rating}>{vet.rating}</Text>
                </View>
              </View>
              <Text style={styles.specialization}>{vet.specialization}</Text>
              <Text style={styles.experience}>{vet.experience} experience</Text>
              <View style={styles.consultationMeta}>
                <Text style={styles.price}>TSH {vet.price}</Text>
                {vet.available && (
                  <View style={styles.availableTag}>
                    <Text style={styles.availableText}>Available Now</Text>
                  </View>
                )}
              </View>
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
});