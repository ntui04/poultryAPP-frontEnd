import { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuthStore } from '@/stores/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function Registration() {
  const [name, setName] = useState('');
  const [number, setnumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();

  const handleRegistration = async () => {
    clearError();
    if (password !== confirmPassword) {
      // You would need to add handling for password mismatch in your store
      return;
    }
    await register(name, number, password);
    if (!error) {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to start using Poultry Pro</Text>
      </View>
      
      <View style={styles.form}>
        {error && <Text style={styles.error}>{error}</Text>}
        
        <Input
          label="Full Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
        />
        
        <Input
          label="number"
          value={number}
          onChangeText={setnumber}
          placeholder="Enter your number"
          keyboardType="number"
          autoCapitalize="none"
          containerStyle={{ marginBottom: 16 }}
        />
        
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password"
          secureTextEntry
        />
        
        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          secureTextEntry
        />
        
        <Button 
          onPress={handleRegistration} 
          loading={isLoading}
        >
          Create Account
        </Button>
        
        <View style={styles.links}>
          <Link href="/auth/login" style={styles.link}>
            Already have an account? Sign in
          </Link>
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
    justifyContent: 'center',
    marginTop: 24,
  },
  link: {
    color: '#2563eb',
    fontSize: 14,
  },
});