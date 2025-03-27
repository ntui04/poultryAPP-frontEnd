import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Pressable, 
  ScrollView, 
  Alert 
} from 'react-native';
import { router } from 'expo-router';
import AuthService from '../services/authentication';

export default function LoginScreen() {
  const [formData, setFormData] = useState({
    phone_number: '',
    password: ''
  });

  const [errors, setErrors] = useState<{ phone_number?: string; password?: string }>({});

  const handleLogin = async () => {
    try {
      // Basic validation
      const newErrors = {};
      if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';
      if (!formData.password) newErrors.password = 'Password is required';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Attempt login
      const response = await AuthService.login(formData);

      if (response && response.userType) {
        // Redirect based on user role
        if (response.userType === 'agrovet') {
          router.replace('/(vetTabs)');
        } else if (response.userType === 'consultvet') {
          router.replace('/(consultTabs)');
        } else {
          router.replace('/(tabs)'); // Default route
        }
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      // Handle login errors
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={[
            styles.input, 
            errors.phone_number && styles.inputError
          ]}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          autoCapitalize="none"
          value={formData.phone_number}
          onChangeText={(text) => {
            setFormData({...formData, phone_number: text});
            if (errors.phone_number) {
              const newErrors = {...errors};
              delete newErrors.phone_number;
              setErrors(newErrors);
            }
          }}
        />
        {errors.phone_number && <Text style={styles.errorText}>{errors.phone_number}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={[
            styles.input, 
            errors.password && styles.inputError
          ]}
          placeholder="Enter your password"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => {
            setFormData({...formData, password: text});
            if (errors.password) {
              const newErrors = {...errors};
              delete newErrors.password;
              setErrors(newErrors);
            }
          }}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      </View>

      <Pressable style={styles.forgotPasswordLink}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </Pressable>

      <Pressable 
        style={styles.loginButton}
        onPress={handleLogin}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </Pressable>

      <View style={styles.registerLink}>
        <Text style={styles.registerLinkText}>
          Don't have an account? 
        </Text>
        <Pressable onPress={() => router.push('/auth/register')}>
          <Text style={styles.registerLinkAction}>Register</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 32,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#2563eb',
  },
  loginButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerLinkText: {
    color: '#64748b',
  },
  registerLinkAction: {
    color: '#2563eb',
    fontWeight: '600',
    marginLeft: 4,
  },
});