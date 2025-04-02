import React, { useState } from 'react';
import { ScrollView, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import AuthService from '../services/authentication'; // Adjust the import path as needed

const EditProfileScreen = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone_number: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async () => {
    // Basic validation
    if (!formData.firstname || !formData.lastname) {
      Alert.alert('Error', 'First Name and Last Name are required');
      return;
    }

    // Password validation if password is being updated
    if (formData.password && formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // Prepare data for update (remove empty fields)
      const updateData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        phone_number: formData.phone_number || undefined,
        ...(formData.password ? { password: formData.password } : {})
      };

      // Call the update profile method
      const updatedUser = await AuthService.updateProfile(updateData);

      // Show success message
      Alert.alert('Success', 'Profile updated successfully');

      // Optional: Navigate away or update local state
    } catch (error) {
      // Handle errors
      Alert.alert('Update Failed', (error as any).message || 'Could not update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContainer}
    >
      <Text>Edit Profile</Text>
     
      <TextInput
        style={styles.input}
        placeholder="First Name *"
        value={formData.firstname}
        onChangeText={(text) => setFormData({ ...formData, firstname: text })}
        autoCapitalize="words"
      />
     
      <TextInput
        style={styles.input}
        placeholder="Last Name *"
        value={formData.lastname}
        onChangeText={(text) => setFormData({ ...formData, lastname: text })}
        autoCapitalize="words"
      />
     
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={formData.phone_number}
        keyboardType="phone-pad"
        onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
      />
     
      <TextInput
        style={styles.input}
        placeholder="New Password (optional)"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />
     
      {formData.password ? (
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
        />
      ) : null}
     
      <TouchableOpacity
        onPress={handleUpdateProfile}
        disabled={isLoading}
      >
        {isLoading ? 'Updating...' : 'Save Changes'}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfileScreen;

// Styles would be defined separately
const styles = {
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  titleq: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
};