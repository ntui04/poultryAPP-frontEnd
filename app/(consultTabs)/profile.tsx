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
              await logout(); // Clear local state first
              const success = await AuthService.logout(); // Now properly awaited
              
              // This will always redirect, but you could add logic if needed
              router.replace('/auth/login');
              
            } catch (error) {
              console.error("Logout error:", error);
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
      id: 'agro_details',
      title: 'Professional Details',
      icon: <Users size={20} color="#2563eb" />,
      onPress: () => router.push('/userprofile/agrodetails'),
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
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            {user?.profileImage ? (
              <Image 
                source={{ uri: user.profileImage }} 
                style={styles.profileImage}
                resizeMode="cover" 
              />
            ) : (
              <View style={styles.profileInitials}>
                <Text style={styles.initialsText}>
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </Text>
              </View>
            )}
            <View style={styles.profileText}>
              <Text style={styles.userName}>{user?.firstname || ''}  {user?.lastname}</Text>
              <Text style={styles.userEmail}>{user?.phone_number}</Text>
            </View>
          </View>
          <Pressable 
            style={styles.editProfileButton}
            onPress={() => router.push('../userprofile/')}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </Pressable>
        </View>
      </View>

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

      {/* Logout Button */}
      <Pressable 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <LogOut size={20} color="#ef4444" />
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
    paddingBottom: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
  },
  headerContent: {
    padding: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  profileInitials: {
    width: 80,
    height: 80,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  initialsText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FF4747',
  },
  profileText: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  editProfileButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  editProfileText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  optionsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    gap: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    marginHorizontal: 24,
    padding: 16,
    backgroundColor: '#fee2e2',
    borderRadius: 16,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 40,
  }
});

export default Profile;