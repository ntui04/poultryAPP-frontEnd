import { Tabs } from 'expo-router';
import { House, Store, MessageCircle, User2, Notebook, ShoppingBag } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#f1f5f9',
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarActiveTintColor: '#FF4747',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: -4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <House size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, size }) => (
            <Store size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <ShoppingBag size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="consultation"
        options={{
          title: 'consultation',
          tabBarIcon: ({ color, size }) => (
            <MessageCircle size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="education"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => (
            <Notebook size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User2 size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}