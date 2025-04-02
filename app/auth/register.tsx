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
import { User, Phone, Lock } from 'lucide-react-native';

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
      formData.password.length >= 6
    );
  };

  const handleRegister = async () => {
    clearError();
    const dataToSend = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      phone_number: formData.phone_number,
      location: formData.location,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
      role: 'farmer'
    };
    const success = await register(dataToSend);
    if (success) {
      router.replace('/');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c',
            }}
            style={styles.backgroundImage}
          />
          <View style={styles.overlay} />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Poultry Pro today</Text>
        </View>

        <View style={styles.form}>
          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.inputContainer}>
            <User size={20} color="#64748b" style={styles.inputIcon} />
            <Input
              label="First Name"
              value={formData.firstname}
              onChangeText={(text) =>
                setFormData({ ...formData, firstname: text })
              }
              placeholder="Enter your first name"
            />
          </View>

          <View style={styles.inputContainer}>
            <User size={20} color="#64748b" style={styles.inputIcon} />
            <Input
              label="Last Name"
              value={formData.lastname}
              onChangeText={(text) =>
                setFormData({ ...formData, lastname: text })
              }
              placeholder="Enter your last name"
            />
          </View>

          <View style={styles.inputContainer}>
            <Phone size={20} color="#64748b" style={styles.inputIcon} />
            <Input
              label="Phone number"
              value={formData.phone_number}
              onChangeText={(text) =>
                setFormData({ ...formData, phone_number: text })
              }
              placeholder="Enter your phone number"
            />
          </View>

          <View style={styles.inputContainer}>
            <Phone size={20} color="#64748b" style={styles.inputIcon} />
            <Input
              label="location"
              value={formData.location}
              onChangeText={(text) =>
                setFormData({ ...formData, location: text })
              }
              placeholder="Enter your location"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color="#64748b" style={styles.inputIcon} />
            <Input
              label="Password"
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
              placeholder="Create a password (min. 6 characters)"
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color="#64748b" style={styles.inputIcon} />
            <Input
              label="Confirm Password"
              value={formData.password_confirmation}
              onChangeText={(text) =>
                setFormData({ ...formData, password_confirmation: text })
              }
              placeholder="Confirm your password"
              secureTextEntry
            />
          </View>

          <Button
            onPress={handleRegister}
            loading={isLoading}
            disabled={!isFormValid()}
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
    height: 300,
    justifyContent: 'flex-end',
    padding: 24,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: 300,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  form: {
    flex: 1,
    padding: 24,
    marginTop: -24,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    top: 40,
    left: 12,
    zIndex: 1,
  },
  error: {
    color: '#ef4444',
    marginBottom: 16,
  },
  footer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    color: '#64748b',
    fontSize: 14,
  },
  link: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
});
