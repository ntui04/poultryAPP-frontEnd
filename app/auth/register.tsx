import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AuthService from '../services/authentication'; // Ensure correct import

const RegisterScreen = () => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    password: '',
    role: 'farmer',
  });

  const [errors, setErrors] = useState<{ general?: string; first_name?: string; last_name?: string; phone_number?: string; password?: string }>({});

  const handleSubmit = async () => {
    try {
      // Clear previous errors
      setErrors({});

      // Client-side validation
      if (!form.first_name || !form.last_name || !form.phone_number || !form.password) {
        setErrors({ general: 'Please fill all fields' });
        return;
      }

      const result = await AuthService.register(form);
      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      console.log('Full error:', error);
      
      if (error instanceof Object && 'errors' in error) {
        if (typeof error.errors === 'object' && error.errors !== null) {
          setErrors(error.errors as Record<string, string>);
        }
      } else {
        Alert.alert(
          'Registration Error', 
          error.message || 'An unknown error occurred'
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register</Text>

      {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}

      <TextInput
        style={[styles.input, errors.first_name && styles.inputError]}
        placeholder="First Name"
        value={form.first_name}
        onChangeText={(text) => setForm({ ...form, first_name: text })}
      />
      {errors.first_name && <Text style={styles.errorText}>{errors.first_name}</Text>}

      <TextInput
        style={[styles.input, errors.last_name && styles.inputError]}
        placeholder="Last Name"
        value={form.last_name}
        onChangeText={(text) => setForm({ ...form, last_name: text })}
      />
      {errors.last_name && <Text style={styles.errorText}>{errors.last_name}</Text>}

      <TextInput
        style={[styles.input, errors.phone_number && styles.inputError]}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={form.phone_number}
        onChangeText={(text) => setForm({ ...form, phone_number: text })}
      />
      {errors.phone_number && <Text style={styles.errorText}>{errors.phone_number}</Text>}

      <TextInput
        style={[styles.input, errors.password && styles.inputError]}
        placeholder="Password"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <Button title="Register" onPress={handleSubmit} color="#28a745" />
    </View>
  );
};

// 🌟 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#dc3545', // Red border for errors
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginBottom: 10,
  },
});

export default RegisterScreen;
