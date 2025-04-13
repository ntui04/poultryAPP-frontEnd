import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Pressable, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { Lock, ShieldCheck } from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { authApi } from '../services/api'; // Correctly import authApi

export default function ResetPasswordScreen() {
  const { phone } = useLocalSearchParams();
  const [form, setForm] = useState({ token: '', password: '' });
  const [error, setError] = useState<{ token?: string, password?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    const err: typeof error = {};
    if (!form.token) err.token = 'Token is required';
    if (!form.password) err.password = 'Password is required';

    if (Object.keys(err).length > 0) {
      setError(err);
      return;
    }

    setLoading(true);
    try {
      // Include password_confirmation in the payload
      await authApi.resetPassword({ ...form, phone, password_confirmation: form.password });
      Alert.alert('Success', 'Password has been reset. You can now login.');
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error resetting password:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to reset password. Please try again.');
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
        <Text style={styles.title}>Set New Password</Text>
        <Text style={styles.subtitle}>Enter the token sent to your phone and your new password</Text>

        {/* Token Input */}
        <View style={[styles.inputWrapper, error.token && styles.inputWrapperError]}>
          <ShieldCheck size={20} color="#64748b" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Reset Token"
            autoCapitalize="none"
            value={form.token}
            onChangeText={(text) => setForm({ ...form, token: text })}
          />
        </View>
        {error.token && <Text style={styles.errorText}>{error.token}</Text>}

        {/* Password Input */}
        <View style={[styles.inputWrapper, error.password && styles.inputWrapperError]}>
          <Lock size={20} color="#64748b" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            autoCapitalize="none"
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
          />
        </View>
        {error.password && <Text style={styles.errorText}>{error.password}</Text>}

        <Pressable
          style={({ pressed }) => [styles.button, loading && styles.disabled, pressed && styles.pressed]}
          onPress={handleReset}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : (
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Reset Password</Text>
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
    paddingHorizontal: 16, height: 56, marginBottom: 12,
  },
  inputWrapperError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  icon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#0f172a' },
  errorText: { color: '#ef4444', fontSize: 12, marginBottom: 8 },
  button: {
    backgroundColor: '#2563eb', borderRadius: 12, height: 56,
    justifyContent: 'center', alignItems: 'center', marginTop: 16,
    shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8,
  },
  disabled: { backgroundColor: '#93c5fd', shadowOpacity: 0 },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  buttonContent: { flexDirection: 'row', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
