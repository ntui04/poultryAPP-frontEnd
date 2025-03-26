import { Tabs } from 'expo-router';
import {
  Home,
  Package2,
  Users,
  CalendarClock,
  BarChart3,
  User,
  ShoppingBag,
  Newspaper
} from 'lucide-react-native';

export default function AgrovetTabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e5e5',
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#15803d', // Green color for agrovet
        tabBarInactiveTintColor: '#64748b',
        tabBarItemStyle: {
          padding: 5,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Home size={size + 2} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="products"
        options={{
          title: 'products',
          tabBarIcon: ({ color, size }) => (
            <ShoppingBag size={size + 2} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: 'orders',
          tabBarIcon: ({ color, size }) => (
            <Package2 size={size + 2} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="education"
        options={{
          title: 'education',
          tabBarIcon: ({ color, size }) => (
            <Newspaper size={size + 2} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size + 2} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
