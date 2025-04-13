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
            onError={() => console.log('Failed to load header image')}
            accessibilityIgnoresInvertColors
          />
          <View style={styles.overlay} />
          <View style={styles.headerContent}>
            <Text style={styles.title} accessibilityRole="header">Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue to AgroApp</Text>
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          {/* Phone Number Input */}
          <View style={styles.inputGroup}>
            <View style={[styles.inputWrapper, errors.phone_number && styles.inputWrapperError]}>
              <Phone size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
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
              <Text style={styles.errorText} accessibilityLiveRegion="assertive">
                {errors.phone_number}
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <View style={[styles.inputWrapper, errors.password && styles.inputWrapperError]}>
              <Lock size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
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
              <Text style={styles.errorText} accessibilityLiveRegion="assertive">
                {errors.password}
              </Text>
            )}
          </View>

          {/* Forgot Password Link */}
          <Pressable
            style={({ pressed }) => [styles.forgotPasswordLink, pressed && styles.pressed]}
            onPress={() => router.push('/auth/RequestResetScreen')}
            accessibilityRole="link"
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            <ChevronRight size={16} color="#2563eb" />
          </Pressable>

          {/* Login Button */}
          <Pressable
            style={({ pressed }) => [
              styles.loginButton, 
              isLoading && styles.loginButtonDisabled,
              pressed && styles.loginButtonPressed
            ]}
            onPress={handleLogin}
            disabled={isLoading}
            accessibilityRole="button"
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

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <Pressable
              onPress={() => router.push('/auth/register')}
              style={({ pressed }) => [styles.registerButton, pressed && styles.pressed]}
              accessibilityRole="link"
            >
              <Text style={styles.registerButtonText}>Create Account</Text>
            </Pressable>
          </View>

          {/* Privacy Policy Link */}
          <View style={styles.legalContainer}>
            <Text style={styles.legalText}>By continuing, you agree to our </Text>
            <Pressable onPress={() => router.push('/')}>
              <Text style={styles.legalLink}>Terms of Service</Text>
            </Pressable>
            <Text style={styles.legalText}> and </Text>
            <Pressable onPress={() => router.push('/')}>
              <Text style={styles.legalLink}>Privacy Policy</Text>
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
    height: 260,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e2e8f0',
  },
  formContainer: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    height: 56,
  },
  inputWrapperError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
    paddingVertical: 16,
  },
  eyeIcon: {
    padding: 8,
    marginLeft: 8,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  forgotPasswordLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 24,
    padding: 4,
  },
  forgotPasswordText: {
    color: '#2563eb',
    fontSize: 14,
    marginRight: 4,
  },
  loginButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#2563eb',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#93c5fd',
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  registerText: {
    color: '#64748b',
    fontSize: 14,
  },
  registerButton: {
    marginLeft: 8,
    padding: 4,
  },
  registerButtonText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  legalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
  },
  legalText: {
    color: '#64748b',
    fontSize: 12,
  },
  legalLink: {
    color: '#2563eb',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.7,
  },
});