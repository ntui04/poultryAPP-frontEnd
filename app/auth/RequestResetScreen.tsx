import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Pressable, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { Phone, Send } from 'lucide-react-native';
import { router } from 'expo-router';
import { authApi } from '../services/api'; // Correctly import authApi

export default function RequestResetScreen() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePhone = (value: string) => /^[\d+]{10,15}$/.test(value);

  const handleSubmit = async () => {
    setError('');
    if (!validatePhone(phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      // Use the correct API method to request a reset token
      await authApi.requestResetToken(phone);
      Alert.alert('Success', 'A reset token has been sent to your phone.');
      router.push({ pathname: '/auth/ResetPasswordScreen', params: { phone } });
    } catch (error) {
      console.error('Error requesting reset token:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to request reset token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Reset Your Password</Text>
        <Text style={styles.subtitle}>Enter your phone number to receive a reset token</Text>

        <View style={[styles.inputWrapper, error && styles.inputWrapperError]}>
          <Phone size={20} color="#64748b" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <Pressable
          style={({ pressed }) => [styles.button, loading && styles.disabled, pressed && styles.pressed]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : (
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Send Token</Text>
              <Send size={20} color="#fff" />
            </View>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8, color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', marginBottom: 16 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc',
    borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0',
    paddingHorizontal: 16, height: 56
  },
  inputWrapperError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#0f172a' },
  errorText: { color: '#ef4444', fontSize: 12, marginTop: 4 },
  button: {
    backgroundColor: '#2563eb', borderRadius: 12, height: 56,
    justifyContent: 'center', alignItems: 'center', marginTop: 24,
    shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8,
  },
  disabled: { backgroundColor: '#93c5fd', shadowOpacity: 0 },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  buttonContent: { flexDirection: 'row', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginRight: 8 },
});
