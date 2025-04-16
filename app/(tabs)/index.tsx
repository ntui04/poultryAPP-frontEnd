import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  RefreshControl,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/stores/auth';
import {
  Bell,
  MapPin,
  TrendingUp,
  ThermometerSun,
  Users,
  Calendar,
  MessageCircle,
  Send,
  X,
} from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Home() {
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AgroAssistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  const farmStats = {
    totalBirds: 2500,
    mortality: 0.5,
    avgWeight: 1.8,
    feedConsumption: 450,
  };

  const upcomingTasks = [
    {
      id: '1',
      title: 'Vaccination Schedule',
      date: 'Today, 2:30 PM',
      type: 'health',
      description: 'Newcastle Disease vaccination for Batch A',
    },
    {
      id: '2',
      title: 'Feed Delivery',
      date: 'Tomorrow, 9:00 AM',
      type: 'feed',
      description: 'Layer feed delivery from Farm Supply Co.',
    },
  ];

  const weatherInfo = {
    temperature: 24,
    humidity: 65,
    condition: 'Partly Cloudy',
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'll help you with that. What specific information do you need about your farm?",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <>
      <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {user?.lastname ? `Welcome back, ${user.lastname}` : 'Welcome back!'} {user?.firstname}
          </Text>

          <View style={styles.location}>
            <MapPin size={16} color="#64748b" />
            <Text style={styles.locationText}>Mbeya, Tanzania</Text>
          </View>
        </View>
        <Pressable
          style={styles.notificationButton}
          // onPress={() => router.push('/notifications')}
        >
          <Bell size={24} color="#1f2937" />
          <View style={styles.notificationBadge} />
        </Pressable>

        {/* <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push('/(tabs)/profile/profile')}
            >
              profile
            </TouchableOpacity> */}
      </View>

      {/* Weather Card */}
      <View style={styles.weatherCard}>
        <View style={styles.weatherInfo}>
          <ThermometerSun size={24} color="#2563eb" />
          <View style={styles.weatherDetails}>
            <Text style={styles.weatherTemp}>{weatherInfo.temperature}°C</Text>
            <Text style={styles.weatherDesc}>{weatherInfo.condition}</Text>
          </View>
        </View>
        <Text style={styles.weatherHumidity}>
          Humidity: {weatherInfo.humidity}%
        </Text>
      </View>

      {/* Farm Statistics */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Farm Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Users size={20} color="#2563eb" />
            <Text style={styles.statValue}>{farmStats.totalBirds}</Text>
            <Text style={styles.statLabel}>Total Birds</Text>
          </View>
          <View style={styles.statCard}>
            <TrendingUp size={20} color="#2563eb" />
            <Text style={styles.statValue}>{farmStats.mortality}%</Text>
            <Text style={styles.statLabel}>Mortality Rate</Text>
          </View>
          <View style={styles.statCard}>
            <Calendar size={20} color="#2563eb" />
            <Text style={styles.statValue}>{farmStats.avgWeight}kg</Text>
            <Text style={styles.statLabel}>Avg Weight</Text>
          </View>
          <View style={styles.statCard}>
            <ThermometerSun size={20} color="#2563eb" />
            <Text style={styles.statValue}>{farmStats.feedConsumption}kg</Text>
            <Text style={styles.statLabel}>Feed Used</Text>
          </View>
        </View>
      </View>

      {/* Upcoming Tasks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Tasks</Text>
        {upcomingTasks.map((task) => (
          <Pressable
            key={task.id}
            style={styles.taskCard}
            // onPress={() => router.push(/task/${task.id})}
          >
            <View style={styles.taskHeader}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskDate}>{task.date}</Text>
            </View>
            <Text style={styles.taskDescription}>{task.description}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => setIsChatOpen(true)}
      >
        <MessageCircle size={24} color="#fff" />
      </TouchableOpacity>

      {/* Chat Modal */}
      <Modal
        visible={isChatOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsChatOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.chatContainer}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle}>AgroAssistant</Text>
              <TouchableOpacity
                onPress={() => setIsChatOpen(false)}
                style={styles.closeButton}
              >
                <X size={24} color="#1f2937" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.messagesContainer}>
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.messageWrapper,
                    msg.sender === 'user' ? styles.userMessage : styles.botMessage,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      msg.sender === 'user'
                        ? styles.userMessageText
                        : styles.botMessageText,
                    ]}
                  >
                    {msg.text}
                  </Text>
                  <Text style={styles.messageTime}>
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type your message..."
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendMessage}
              >
                <Send size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    padding: 24,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  taskDate: {
    fontSize: 14,
    color: '#64748b',
  },
  taskDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  header: {
    marginTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#64748b',
  },
  notificationButton: {
    position: 'relative',
    padding: 10,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: '#ef4444',
    borderRadius: 4,
  },
  weatherCard: {
    backgroundColor: '#f8fafc',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherDetails: {
    marginLeft: 12,
  },
  weatherTemp: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  weatherDesc: {
    fontSize: 14,
    color: '#475569',
  },
  weatherHumidity: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748b',
  },
  fabButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#2563eb',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageWrapper: {
    maxWidth: '80%',
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563eb',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f5f9',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#1f2937',
  },
  messageTime: {
    fontSize: 12,
    color: '#64748b',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: '#2563eb',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
