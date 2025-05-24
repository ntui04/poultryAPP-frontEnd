import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Phone, Lock, ArrowRight, Eye, EyeOff, ChevronRight } from 'lucide-react-native';
import AuthService from '../services/authentication';

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone_number: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ phone_number?: string; password?: string }>({});

  const validatePhoneNumber = (phone: string) => {
    // Basic international phone validation (adjust as needed)
    return /^[\d+]{10,15}$/.test(phone);
  };

  const validatePassword = (password: string) => {
    // Minimum 8 characters, at least 1 letter and 1 number
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  };

  const handleLogin = async () => {
    try {
      // Reset errors
      setErrors({});
      
      // Validation
      const newErrors: { phone_number?: string; password?: string } = {};
      
      if (!formData.phone_number) {
        newErrors.phone_number = 'Phone number is required';
      } else if (!validatePhoneNumber(formData.phone_number)) {
        newErrors.phone_number = 'Please enter a valid phone number';
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (!validatePassword(formData.password)) {
        newErrors.password = 'Password must be at least 8 characters with letters and numbers';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setIsLoading(true);

      // Attempt login
      const response = await AuthService.login(formData);

      if (response && response.userType) {
        // Route mapping
        const routes = {
          'agrovet-shop': '/(vetTabs)',
          'agro-officer': '/(consultTabs)',
          'farmer': '/(tabs)'
        };

        const route = routes[response.userType] || '/';
        router.replace(route);
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      showErrorAlert(
        'Login Failed',
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const showErrorAlert = (title: string, message: string) => {
    Alert.alert(
      title,
      message,
      [{ text: 'OK', style: 'default' }]
    );
  };

  const headerImageSource = useMemo(() => ({ 
    uri: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=800' 
  }), []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Image
            source={headerImageSource}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <View style={styles.overlay} />
          <View style={styles.headerContent}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue to AgroApp</Text>
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Sign In</Text>
            <Text style={styles.formSubtitle}>Enter your credentials to continue</Text>
          </View>

          {/* Phone Number Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={[styles.inputWrapper, errors.phone_number && styles.inputWrapperError]}>
              <Phone size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
                autoComplete="tel"
                autoCapitalize="none"
                value={formData.phone_number}
                onChangeText={(text) => {
                  setFormData({ ...formData, phone_number: text });
                  if (errors.phone_number) {
                    setErrors(prev => ({ ...prev, phone_number: undefined }));
                  }
                }}
                accessibilityLabel="Phone number input"
                accessibilityHint="Enter your registered phone number"
              />
            </View>
            {errors.phone_number && (
              <Text style={styles.errorText}>{errors.phone_number}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={[styles.inputWrapper, errors.password && styles.inputWrapperError]}>
              <Lock size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#94a3b8"
                secureTextEntry={!showPassword}
                autoComplete="password"
                value={formData.password}
                onChangeText={(text) => {
                  setFormData({ ...formData, password: text });
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }
                }}
                accessibilityLabel="Password input"
                accessibilityHint="Enter your password"
              />
              <TouchableOpacity 
                onPress={togglePasswordVisibility}
                style={styles.eyeIcon}
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#64748b" />
                ) : (
                  <Eye size={20} color="#64748b" />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          <Pressable
            style={styles.forgotPasswordLink}
            onPress={() => router.push('/auth/RequestResetScreen')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            <ChevronRight size={16} color="#FF4747" />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.loginButton, 
              isLoading && styles.loginButtonDisabled,
              pressed && styles.loginButtonPressed
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.loginButtonContent}>
                <Text style={styles.loginButtonText}>Sign In</Text>
                <ArrowRight size={20} color="#fff" />
              </View>
            )}
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <Pressable
              onPress={() => router.push('/auth/register')}
              style={styles.registerButton}
            >
              <Text style={styles.registerButtonText}>Create Account</Text>
            </Pressable>
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
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: 280,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backgroundImage: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.8))',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  formContainer: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
  },
  formHeader: {
    marginBottom: 32,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 15,
    color: '#64748b',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    height: 56,
  },
  inputWrapperError: {
    borderColor: '#FF4747',
    backgroundColor: '#fff5f5',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: '#FF4747',
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
  },
  forgotPasswordLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: '#FF4747',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  loginButton: {
    backgroundColor: '#FF4747',
    borderRadius: 14,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4747',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    backgroundColor: '#fca5a5',
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    color: '#64748b',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  registerText: {
    color: '#64748b',
    fontSize: 15,
  },
  registerButton: {
    padding: 4,
  },
  registerButtonText: {
    color: '#FF4747',
    fontSize: 15,
    fontWeight: '600',
  }
});