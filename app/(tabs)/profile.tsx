import React, { useState } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  Image, 
  ScrollView, 
  Pressable, 
  Switch,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/auth';
import { 
  User, 
  Settings, 
  CreditCard, 
  HelpCircle, 
  FileText, 
  LogOut, 
  ChevronRight,
  Bell,
  Lock,
  MapPin,
  Users,
  ShoppingBag
} from 'lucide-react-native';
import AuthService from '../services/authentication';

const Profile = () => {
  const { user, logout } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          onPress: async () => {
            try {
              // Call the service first, which will make API call and clear storage
              await AuthService.logout();
              
              // Then update the app state
              logout();
              
              // Navigate to login
              router.replace('/auth/login');
            } catch (error) {
              console.error("Logout error:", error);
              
              // If there was an error, we should still let the user logout
              // from the local app state
              logout();
              router.replace('/auth/login');
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const profileOptions = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: <User size={20} color="#2563eb" />,
      onPress: () => router.push('/userprofile/profileinfo'),
    },
    {
      id: 'farm',
      title: 'Farm Details',
      icon: <Users size={20} color="#2563eb" />,
      onPress: () => router.push('../vendprofile/'),
    },
    {
      id: 'location',
      title: 'Manage Addresses',
      icon: <MapPin size={20} color="#2563eb" />,
      onPress: () => router.push('../shop/'),
    },
    {
      id: 'security',
      title: 'Security Settings',
      icon: <Lock size={20} color="#2563eb" />,
      onPress: () => router.push('/'),
    }
  ];

  const accountOptions = [
    {
      id: 'orders',
      title: 'My Orders',
      icon: <ShoppingBag size={20} color="#2563eb" />,
      onPress: () => router.push('/(tabs)/orders'),
    },
    {
      id: 'payments',
      title: 'Payment Methods',
      icon: <CreditCard size={20} color="#2563eb" />,
      onPress: () => router.push('/'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell size={20} color="#2563eb" />,
      onPress: () => {},
      isSwitch: true,
      value: notificationsEnabled,
      onValueChange: () => setNotificationsEnabled(!notificationsEnabled),
    }
  ];

  const supportOptions = [
    {
      id: 'help',
      title: 'Help Center',
      icon: <HelpCircle size={20} color="#2563eb" />,
      onPress: () => router.push('/support/HelpCenter'),
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      icon: <FileText size={20} color="#2563eb" />,
      onPress: () => router.push('/support/Terms'),
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: <FileText size={20} color="#2563eb" />,
      onPress: () => router.push('/support/Privacy'),
    }
  ];

  const renderOption = (option) => (
    <Pressable
      key={option.id}
      style={styles.optionItem}
      onPress={option.isSwitch ? undefined : option.onPress}
    >
      <View style={styles.optionLeft}>
        {option.icon}
        <Text style={styles.optionText}>{option.title}</Text>
      </View>
      
      {option.isSwitch ? (
        <Switch
          value={option.value}
          onValueChange={option.onValueChange}
          trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
          thumbColor={option.value ? "#2563eb" : "#f4f4f5"}
        />
      ) : (
        <ChevronRight size={20} color="#64748b" />
      )}
    </Pressable>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileImageContainer}>
            {user?.profileImage ? (
              <Image 
                source={{ uri: user.profileImage }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.profileInitials}>
                <Text style={styles.initialsText}>
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </Text>
              </View>
            )}
          </View>
          
          <Text style={styles.userName}>{user?.firstname || ''}  {user?.lastname}</Text>
          <Text style={styles.userEmail}>{user?.phone_number}</Text>
          
          <Pressable 
            style={styles.editProfileButton}
            onPress={() => router.push('../userprofile/')}
          >
            <User size={16} color="#FF4747" style={styles.editProfileIcon} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </Pressable>
        </View>
      </View>

      {/* Options Sections */}
      <View style={styles.content}>
        {/* Profile Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.optionsContainer}>
            {profileOptions.map(option => renderOption(option))}
          </View>
        </View>

        {/* Account Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.optionsContainer}>
            {accountOptions.map(option => renderOption(option))}
          </View>
        </View>

        {/* Support Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.optionsContainer}>
            {supportOptions.map(option => renderOption(option))}
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <Pressable 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <LogOut size={20} color="#FF4747" />
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>

      {/* App Version */}
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#FF4747',
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileInitials: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FF4747',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editProfileIcon: {
    marginRight: 8,
  },
  editProfileText: {
    color: '#FF4747',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  optionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    marginHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff2f2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4747',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 40,
  },
});

export default Profile;