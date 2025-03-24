import { Stack } from 'expo-router';

export default function ShopLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'My Shop',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="edit" 
        options={{ 
          title: 'Edit Shop Profile',
          headerShown: true,
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="products" 
        options={{ 
          title: 'Products',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="add-product" 
        options={{ 
          title: 'Add Product',
          headerShown: true,
          presentation: 'modal'
        }} 
      />
      <Stack.Screen 
        name="edit-product" 
        options={{ 
          title: 'Edit Product',
          headerShown: true,
          presentation: 'modal'
        }} 
      />
    </Stack>
  );
}