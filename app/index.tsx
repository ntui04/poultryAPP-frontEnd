// screens/welcome/TestimonyScreen.jsx
import { View, Text, StyleSheet, ScrollView, Image, Pressable, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';

export default function TestimonyScreen() {
  return (
    <View style={styles.container}>
      {/* Header/Logo Section */}
      <View style={styles.header}>
        <Image 
          source={require('../assets/images/icon.png')} // Add your logo image
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>KUKU ONLINE</Text>
      </View>

      {/* Testimonials Carousel */}
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        style={styles.testimonialContainer}
      >
        {/* Testimony 1 */}
        <View style={styles.testimonialCard}>
          <Image 
                      source={require('../assets/images/icon.png')} // Add your logo image
                      // Add testimony images
            style={styles.testimonialImage}
          />
          <Text style={styles.testimonialText}>
            "This app helped me connect with trusted vets and suppliers, increasing my farm productivity by 25%!"
          </Text>
          <Text style={styles.testimonialAuthor}>- John Kamau, Poultry Farmer</Text>
        </View>

       

       
      </ScrollView>

      {/* Login/Register Buttons */}
      <View style={styles.authButtons}>
        <TouchableOpacity 
          style={[styles.button, styles.loginButton]} 
          onPress={() => router.push('../../auth/login')}
        >
          <Text style={styles.buttonText}>Login</Text>
          <ArrowRight size={20} color="#fff" />
        </TouchableOpacity>

        
        <TouchableOpacity
          style={[styles.button, styles.registerButton]} 
          onPress={() => router.push('../../auth/register')}
        >
          <Text style={styles.registerButtonText}>Create an Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginTop: 10,
  },
  testimonialContainer: {
    height: 350,
  },
  testimonialCard: {
    width: 350,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    height: 350,
    marginLeft: 80,
  },
  testimonialImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  testimonialText: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  testimonialAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  authButtons: {
    padding: 24,
    marginTop: 20,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginButton: {
    backgroundColor: '#2563eb',
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  registerButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
});