import { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuthStore } from '@/stores/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();

  // Default user credentials for demo
  const defaultUsers = {
    normal: {
      email: 'user@example.com',
      password: 'password123',
      redirectPath: '/(tabs)', // Regular user tabs
    },
    agrovet: {
      email: 'agrovet@example.com',
      password: 'password123',
      redirectPath: '/(vetTabs)', // Agrovet-specific tabs
    },
    consultvet: {
      email: 'consultvet@example.com',
      password: 'password123',
      redirectPath: '/(consultTabs)', // Agrovet-specific tabs
    },
  };

  const handleLogin = async () => {
    clearError();
    const result = await login(email, password);
  
    if (!error && result) {
      // Determine redirect based on user role
      switch (result.userType) {
        case 'agrovet':
          router.replace('/vetTabs');
          break;
        case 'consultvet':
          router.replace('/consultTabs');
          break;
        default: // Normal user
          router.replace('/(tabs)');
          break;
      }
    }
  };
  

  const loginAsDefaultUser = (userType) => {
    const userData = defaultUsers[userType];
    setEmail(userData.email);
    setPassword(userData.password);

    // Auto-login with specific redirect
    clearError();
    login(userData.email, userData.password).then((result) => {
      if (!error) {
        router.replace(userData.redirectPath);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/kuku.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue to Poultry Pro</Text>
      </View>

      <View style={styles.form}>
        {error && <Text style={styles.error}>{error}</Text>}

        <Input
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          containerStyle={{ marginBottom: 16 }}
        />

        <View style={{ marginBottom: 24 }}>
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />
        </View>

        <Button onPress={handleLogin} loading={isLoading}>
          Sign In
        </Button>

        <View style={styles.links}>
          <Link href="/(auth)/register" style={styles.link}>
            Create an account
          </Link>
          <Link href="/(auth)/forgot-password" style={styles.link}>
            Forgot password?
          </Link>
        </View>

        {/* Demo User Selection */}
        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>Demo Login Options</Text>
          <View style={styles.demoButtons}>
            <TouchableOpacity
              style={styles.demoButton}
              onPress={() => loginAsDefaultUser('normal')}
            >
              <Text style={styles.demoButtonText}>Login as User</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.demoButton, styles.demoButtonAgrovet]}
              onPress={() => loginAsDefaultUser('agrovet')}
            >
              <Text style={styles.demoButtonText}>Login as Agrovet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoButton, styles.demoButtonAgrovetc]}
              onPress={() => loginAsDefaultUser('consultvet')}
            >
              <Text style={styles.demoButtonText}>Login as Vet-officer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  error: {
    color: '#ef4444',
    marginBottom: 16,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  link: {
    color: '#2563eb',
    fontSize: 14,
  },
  demoContainer: {
    marginTop: 40,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: '#64748b',
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  demoButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  demoButtonAgrovet: {
    backgroundColor: '#15803d', // Different color for agrovet
  },
  demoButtonAgrovetc: {
    backgroundColor: 'orange', // Different color for agrovet
  },
  demoButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
