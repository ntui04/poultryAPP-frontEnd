import { useState, useEffect } from 'react';                    
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Pressable, 
  TextInput,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';
import { Search, BookOpen, CirclePlay as PlayCircle } from 'lucide-react-native';
import { articlesApi } from '../services/api';
import { mediaUrl } from '../services/api';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  image_url: string;
  created_at?: string;
}


export default function Education() {
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const mediaUrl = 'http://192.168.90.32:8000/storage/';

  const fetchArticles = async () => {
    try {
      setError(null);
      const response = await articlesApi.getAllPublic(); // 👈 for public view
      setArticles(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchArticles();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchArticles();
    setRefreshing(false);
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Poultry Articles</Text>
        <Text style={styles.subtitle}>Share your knowledge and experiences</Text>
        
        <View style={styles.toolbarContainer}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#64748b" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search articles..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94a3b8"
            />
          </View>
          
          <TouchableOpacity 
            onPress={() => router.push('/articles/managepost/PostManage')} 
            style={styles.addButton}
          >
            <PlayCircle size={20} color="#ffffff" />
            <Text style={styles.addButtonText}>Manage</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={fetchArticles}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : filteredArticles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No articles found</Text>
          </View>
        ) : (
          filteredArticles.map((article) => (
            <Pressable
              key={article.id}
              style={styles.articleCard}
              onPress={() => router.push(`/articles/${article.id}`)}
            >
              <Image 
                source={{uri: mediaUrl + article.image_url}}  
                style={styles.articleImage} 
              />
              <View style={styles.articleInfo}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{article.category}</Text>
                </View>
                <Text style={styles.articleTitle} numberOfLines={2}>
                  {article.title}
                </Text>
                <Text style={styles.articleAuthor}>By {article.author}</Text>
                <View style={styles.articleMeta}>
                  <BookOpen size={16} color="#64748b" />
                  <Text style={styles.readTime}>{getReadTime(article.content)}</Text>
                </View>
              </View>
            </Pressable>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#FF4747',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 24,
  },
  toolbarContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: -24,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    padding: 24,
    paddingTop: 36,
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  articleImage: {
    width: 120,
    height: 160,
  },
  articleInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  categoryBadge: {
    backgroundColor: '#fff2f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryText: {
    color: '#FF4747',
    fontSize: 13,
    fontWeight: '600',
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 24,
  },
  articleAuthor: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
  },
  readTime: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    margin: 16,
  },
  errorText: {
    color: '#FF4747',
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 15,
  },
  retryButton: {
    backgroundColor: '#FF4747',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    margin: 16,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '500',
  },
});