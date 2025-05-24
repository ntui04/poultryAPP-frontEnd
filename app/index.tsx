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
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>KUKU ONLINE</Text>
        <Text style={styles.tagline}>Your Trusted Poultry Partner</Text>
      </View>

      {/* Testimonials Carousel */}
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.testimonialContent}
        style={styles.testimonialContainer}
      >
        {/* Testimony 1 */}
        <View style={styles.testimonialCard}>
          <View style={styles.testimonialImageContainer}>
            <Image 
              source={require('../assets/images/logo.png')}
              style={styles.testimonialImage}
            />
            <View style={styles.quoteMark}>
              <Text style={styles.quoteText}>"</Text>
            </View>
          </View>
          <Text style={styles.testimonialText}>
            "This app helped me connect with trusted vets and suppliers, increasing my farm productivity by 25%!"
          </Text>
          <View style={styles.authorSection}>
            <Text style={styles.authorName}>Constantine Clement</Text>
            <Text style={styles.authorRole}>Poultry Farmer</Text>
          </View>
        </View>
      </ScrollView>

      {/* Login/Register Buttons */}
      <View style={styles.authButtons}>
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => router.push('../../auth/login')}
        >
          <Text style={styles.loginButtonText}>Get Started</Text>
          <ArrowRight size={20} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton} 
          onPress={() => router.push('../../auth/register')}
        >
          <Text style={styles.registerButtonText}>Create an Account</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing you agree to our{' '}
          <Text style={styles.termsLink}>Terms & Conditions</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 24,
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: '#FF4747',
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FF4747',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  testimonialContainer: {
    marginBottom: 30,
    marginLeft: 50,
  },
  testimonialContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testimonialCard: {
    width: 320,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#FF4747',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 4,
    marginHorizontal: 20,
  },
  testimonialImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  testimonialImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quoteMark: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: '#FF4747',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: -4,
  },
  testimonialText: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '500',
  },
  authorSection: {
    alignItems: 'center',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF4747',
    marginBottom: 4,
  },
  authorRole: {
    fontSize: 14,
    color: '#64748b',
  },
  authButtons: {
    padding: 24,
    paddingBottom: 40,
  },
  loginButton: {
    backgroundColor: '#FF4747',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#FF4747',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  registerButton: {
    backgroundColor: '#fff2f2',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  registerButtonText: {
    color: '#FF4747',
    fontSize: 18,
    fontWeight: '600',
  },
  termsText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 13,
  },
  termsLink: {
    color: '#FF4747',
    fontWeight: '600',
  }
});