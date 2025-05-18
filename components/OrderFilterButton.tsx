import { Pressable, Text, StyleSheet } from 'react-native';

interface OrderFilterButtonProps {
  label: string;
  value: string;
  isActive: boolean;
  onPress: () => void;
}

export function OrderFilterButton({ label, value, isActive, onPress }: OrderFilterButtonProps) {
  return (
    <Pressable
      style={[styles.filterButton, isActive && styles.filterButtonActive]}
      onPress={onPress}
    >
      <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: 100,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#ffffff',
  },
});