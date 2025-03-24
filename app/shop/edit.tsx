import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function EditShop() {
  const [formData, setFormData] = useState({
    name: 'Farm Supply Co.',
    description: 'Your one-stop shop for all poultry farming needs.',
    address: '123 Farmers Lane, Nairobi',
    phone: '+254 712 345 678',
    openTime: '8:00 AM',
    closeTime: '6:00 PM',
    workingDays: 'Monday - Saturday',
  });

  const handleSubmit = () => {
    // Implement update logic here
    console.log('Update shop:', formData);
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Input
          label="Shop Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter shop name"
        />

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textarea}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Enter shop description"
            multiline
            numberOfLines={4}
          />
        </View>

        <Input
          label="Address"
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          placeholder="Enter shop address"
        />

        <Input
          label="Phone Number"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          placeholder="Enter phone number"
        />

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Input
              label="Opening Time"
              value={formData.openTime}
              onChangeText={(text) => setFormData({ ...formData, openTime: text })}
              placeholder="e.g. 8:00 AM"
            />
          </View>
          <View style={styles.halfField}>
            <Input
              label="Closing Time"
              value={formData.closeTime}
              onChangeText={(text) => setFormData({ ...formData, closeTime: text })}
              placeholder="e.g. 6:00 PM"
            />
          </View>
        </View>

        <Input
          label="Working Days"
          value={formData.workingDays}
          onChangeText={(text) => setFormData({ ...formData, workingDays: text })}
          placeholder="e.g. Monday - Saturday"
        />

        <Button onPress={handleSubmit}>
          Save Changes
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  form: {
    padding: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfField: {
    flex: 1,
  },
});