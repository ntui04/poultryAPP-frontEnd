import { Stack } from 'expo-router';

export default function ShopLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="[id]" 
        options={{ 
          title: 'user order',
          headerShown: false,
        }} 
      />
     
    </Stack>
  );
}