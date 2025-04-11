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
  RefreshControl
} from 'react-native';
import { router } from 'expo-router';
import { Search, BookOpen, CirclePlay as PlayCircle } from 'lucide-react-native';
import { articlesApi } from '../services/api';

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

  const mediaUrl = 'http://192.168.6.32:8000/storage/';

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
        <Text style={styles.title}>Learn & Grow</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses and articles..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>


      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest Articles</Text>
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
              onPress={() => router.push(`/articles/${article.id}`)}>
                {/* /articles/edit/${item.id}`) */}
              <Image 
                source={{uri:mediaUrl + article.image_url}}  style={styles.articleImage} />
                 {/* <Image source={{ uri:mediaUrl + product.image }} style={styles.productImage}  */}
              <View style={styles.articleInfo}>
                <View style={styles.categoryContainer}>
                  <Text style={styles.category}>{article.category}</Text>
                </View>
                <Text style={styles.articleTitle}>{article.title}</Text>
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  courseCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  courseImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  courseInfo: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  instructor: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  courseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#64748b',
  },
  rating: {
    fontSize: 14,
    color: '#eab308',
    fontWeight: '500',
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  articleImage: {
    width: 120,
    height: 140,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  articleInfo: {
    flex: 1,
    padding: 16,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  category: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '500',
    alignSelf: 'flex-start',
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  articleAuthor: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTime: {
    marginLeft: 4,
    fontSize: 14,
    color: '#64748b',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 16,
  },
});