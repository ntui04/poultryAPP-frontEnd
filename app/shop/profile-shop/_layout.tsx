import { Stack } from 'expo-router';

export default function ShopDetailsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: 'Shop Details',
          headerShown: false,
        }} 
      />
     
    </Stack>
  );
}