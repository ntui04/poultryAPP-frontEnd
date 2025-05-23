import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  FlatList,
} from 'react-native';
import {
  Search,
  ShoppingBag,
  Heart,
  Bell,
  MessageCircle,
  Send,
  X,
} from 'lucide-react-native';
import mistralAIService from '../services/mistralAI';
import { franc } from 'franc';
import { mediaUrl } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { productsApi } from '../services/api';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AgroAssistant. How can I help you today?\n\nHabari! Mimi ni Msaidizi wa Kilimo. Nawezaje kukusaidia leo?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      const detectedLang = franc(message, { whitelist: ['eng', 'swh'] });
      const language = detectedLang === 'swh' ? 'sw' : 'en';

      const response = await mistralAIService.generateResponse(message, language);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: error instanceof Error 
          ? error.message 
          : "I'm sorry, I couldn't process your request. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const categories = [
    { id: 1, name: 'Broilers', icon: '🐔' },
    { id: 2, name: 'Layers', icon: '🥚' },
    { id: 3, name: 'Feed', icon: '🌾' },
    { id: 4, name: 'Medicine', icon: '💊' },
    { id: 5, name: 'Equipment', icon: '⚙️' },
  ];

  // Fetch token on mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };
    fetchToken();
  }, []);

  // Fetch products when token is available
  const fetchProducts = async () => {
    try {
      const response = await productsApi.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: mediaUrl + item.image }}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.product_name}
        </Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.productPrice}>
          TSh {item.price.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search in Poultry Market"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.headerIcon}>
          <Bell size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon}>
          <ShoppingBag size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        ListHeaderComponent={() => (
          <>
            {/* Categories */}
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesList}
            />

            {/* Banners */}
            <View style={styles.banner}>
              <Image
                source={require('../../assets/images/banner.jpg')}
                style={styles.bannerImage}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Featured Products</Text>
            </View>
          </>
        )}
        data={products}
        renderItem={renderProductItem}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* Chat FAB */}
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
              <View style={styles.chatHeaderLeft}>
                <Image 
                  source={require('../../assets/images/bot-avatar.png')} 
                  style={styles.botAvatar} 
                />
                <View>
                  <Text style={styles.chatTitle}>AgroAssistant</Text>
                  <Text style={styles.chatSubtitle}>Poultry Expert</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setIsChatOpen(false)}
                style={styles.closeButton}
              >
                <X size={24} color="#1f2937" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              ref={messagesEndRef} 
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
            >
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.messageWrapper,
                    msg.sender === 'user' ? styles.userMessage : styles.botMessage,
                  ]}
                >
                  {msg.sender === 'bot' && (
                    <Image 
                      source={require('../../assets/images/bot-avatar.png')} 
                      style={styles.messageBotAvatar} 
                    />
                  )}
                  <View style={[
                    styles.messageContent,
                    msg.sender === 'user' ? styles.userMessageContent : styles.botMessageContent,
                  ]}>
                    <Text style={[
                      styles.messageText,
                      msg.sender === 'user' ? styles.userMessageText : styles.botMessageText,
                    ]}>
                      {msg.text}
                    </Text>
                    <Text style={[
                      styles.messageTime,
                      msg.sender === 'user' ? styles.userMessageTime : styles.botMessageTime,
                    ]}>
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>
              ))}
              {isTyping && (
                <View style={[styles.messageWrapper, styles.botMessage]}>
                  <Image 
                    source={require('../../assets/images/bot-avatar.png')} 
                    style={styles.messageBotAvatar} 
                  />
                  <View style={styles.typingIndicator}>
                    <View style={styles.typingDots}>
                      <View style={[styles.dot, styles.dot1]} />
                      <View style={[styles.dot, styles.dot2]} />
                      <View style={[styles.dot, styles.dot3]} />
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Ask about poultry farming..."
                placeholderTextColor="#94a3b8"
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
                onPress={handleSendMessage}
                disabled={!message.trim()}
              >
                <Send size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FF4747',
    paddingTop: 48,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingHorizontal: 12,
    marginRight: 12,
    height: 36,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  headerIcon: {
    padding: 8,
  },
  categoriesList: {
    backgroundColor: '#fff',
    paddingVertical: 12,
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 12,
    width: 60,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  banner: {
    marginVertical: 12,
    paddingHorizontal: 12,
  },
  bannerImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  section: {
    padding: 12,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: (width - 36) / 2,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: (width - 36) / 2,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 8,
  },
  productName: {
    fontSize: 14,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4747',
    marginBottom: 4,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  salesText: {
    fontSize: 12,
    color: '#666',
  },
  fabButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#FF4747',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chatHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  chatSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  closeButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingBottom: 16,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  messageBotAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageContent: {
    maxWidth: '80%',
    padding: 8,
    borderRadius: 8,
  },
  userMessageContent: {
    backgroundColor: '#FF4747',
  },
  botMessageContent: {
    backgroundColor: '#f3f4f6',
  },
  messageText: {
    fontSize: 14,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#1f2937',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  userMessageTime: {
    color: '#f3f4f6',
  },
  botMessageTime: {
    color: '#6b7280',
  },
  typingIndicator: {
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 8,
  },
  typingDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 24,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6b7280',
  },
  dot1: {
    animationDelay: '0s',
  },
  dot2: {
    animationDelay: '0.2s',
  },
  dot3: {
    animationDelay: '0.4s',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1f2937',
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#FF4747',
    borderRadius: 8,
    padding: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#f3f4f6',
  },
});
