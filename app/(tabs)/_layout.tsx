import { Tabs } from 'expo-router';
import { House, Store, MessageCircle, ShieldPlus } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e5e5',
          height: 65,              // Increased height (default is ~50)
          paddingBottom: 10,       // Add some padding at the bottom
          paddingTop: 5,           // Add some padding at the top
        },
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#64748b', // Lighter color for inactive tabs
        tabBarShowLabel: true,              // Hide tab labels
      }}>
      <Tabs.Screen
    name="index"
    options={{
      title: 'Home',
      tabBarIcon: ({ color, size }) => <House size={size + 2} color={color} />, // Use House icon
    }}
  />
      {/* Rest of your tab screens - with size + 2 for each icon */}
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, size }) => <Store size={size + 2} color={color} />,
        }}
      />
     
      <Tabs.Screen
        name="consultation"
        options={{
          title: 'consultation',
          tabBarIcon: ({ color, size }) => <MessageCircle size={size + 2} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <ShieldPlus size={size + 2} color={color} />,
        }}
      />
    </Tabs>
  );
}