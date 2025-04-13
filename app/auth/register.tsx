import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuthStore } from '@/stores/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { User, Phone, Lock, MapPin } from 'lucide-react-native';

export default function Register() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone_number: '',
    location: '',
    password: '',
    password_confirmation: '',
  });

  const { register, isLoading, error, clearError } = useAuthStore();

  const isFormValid = () => {
    return (
      formData.firstname.length > 0 &&
      formData.lastname.length > 0 &&
      formData.phone_number.length > 0 &&
      formData.location.length > 0 &&
      formData.password.length >= 6 &&
      formData.password === formData.password_confirmation
    );
  };

  const handleRegister = async () => {
    clearError();
    const dataToSend = {
      ...formData,
      role: 'farmer'
    };
    const success = await register(dataToSend);
    if (success) {
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&q=80',
            }}
            style={styles.backgroundImage}
          />
          <View style={styles.overlay} />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our farming community today</Text>
        </View>

        <View style={styles.form}>
          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.row}>
            <View style={styles.column}>
              <Input
                label="First Name"
                value={formData.firstname}
                onChangeText={(text) =>
                  setFormData({ ...formData, firstname: text })
                }
                placeholder="Enter first name"
                icon={<User size={20} color="#64748b" />}
              />
            </View>
            <View style={styles.column}>
              <Input
                label="Last Name"
                value={formData.lastname}
                onChangeText={(text) =>
                  setFormData({ ...formData, lastname: text })
                }
                placeholder="Enter last name"
                icon={<User size={20} color="#64748b" />}
              />
            </View>
          </View>

          <Input
            label="Phone Number"
            value={formData.phone_number}
            onChangeText={(text) =>
              setFormData({ ...formData, phone_number: text })
            }
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            icon={<Phone size={20} color="#64748b" />}
          />

          <Input
            label="Location"
            value={formData.location}
            onChangeText={(text) =>
              setFormData({ ...formData, location: text })
            }
            placeholder="Enter location"
            icon={<MapPin size={20} color="#64748b" />}
          />

          <Input
            label="Password"
            value={formData.password}
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
            placeholder="Create password (min. 6 characters)"
            secureTextEntry
            icon={<Lock size={20} color="#64748b" />}
          />

          <Input
            label="Confirm Password"
            value={formData.password_confirmation}
            onChangeText={(text) =>
              setFormData({ ...formData, password_confirmation: text })
            }
            placeholder="Confirm password"
            secureTextEntry
            icon={<Lock size={20} color="#64748b" />}
          />

          <Button
            onPress={handleRegister}
            loading={isLoading}
            disabled={!isFormValid()}
            style={styles.button}
          >
            Create Account
          </Button>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Link href="/login" style={styles.link}>
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    height: 240,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  form: {
    padding: 24,
  },
  error: {
    color: '#ef4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  column: {
    flex: 1,
  },
  button: {
    marginTop: 8,
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  footerText: {
    color: '#64748b',
  },
  link: {
    color: '#0891b2',
    fontWeight: '600',
  },
});