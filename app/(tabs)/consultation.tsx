import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Calendar, Clock, Star } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';

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
        <Text style={styles.title}>Book a Consultation</Text>
        <Text style={styles.subtitle}>
          Connect with experienced veterinarians for expert advice
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Veterinarians</Text>
        {veterinarians.map((vet) => (
          <Pressable
            key={vet.id}
            style={styles.vetCard}
            onPress={() => router.push(`/book-consultation/${vet.id}`)}>
            <Image source={{ uri: vet.image }} style={styles.vetImage} />
            <View style={styles.vetInfo}>
              <View style={styles.vetHeader}>
                <Text style={styles.vetName}>{vet.name}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#eab308" fill="#eab308" />
                  <Text style={styles.rating}>{vet.rating}</Text>
                </View>
              </View>
              <Text style={styles.specialization}>{vet.specialization}</Text>
              <Text style={styles.experience}>{vet.experience} experience</Text>
              <View style={styles.consultationMeta}>
                <Text style={styles.price}>TSH {vet.price}</Text>
                {vet.available && (
                  <View style={styles.availableTag}>
                    <Text style={styles.availableText}>Available Today</Text>
                  </View>
                )}
              </View>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How it works</Text>
        <View style={styles.stepCard}>
          <View style={styles.step}>
            <Calendar size={24} color="#2563eb" />
            <Text style={styles.stepTitle}>Book Appointment</Text>
            <Text style={styles.stepDescription}>
              Choose your preferred vet and schedule a convenient time
            </Text>
          </View>
          <View style={styles.step}>
            <Clock size={24} color="#2563eb" />
            <Text style={styles.stepTitle}>Get Confirmation</Text>
            <Text style={styles.stepDescription}>
              Receive instant confirmation and reminder before the consultation
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  vetCard: {
    flexDirection: 'row',
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
  vetImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  vetInfo: {
    flex: 1,
    marginLeft: 16,
  },
  vetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vetName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  specialization: {
    fontSize: 14,
    color: '#2563eb',
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
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  availableTag: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  availableText: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '500',
  },
  stepCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  step: {
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 12,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748b',
  },
});