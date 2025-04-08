import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  Dimensions,
  Share,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Heart, MessageCircle, Share2, BookOpen } from 'lucide-react-native';
import { articlesApi } from '../services/api';

const { width } = Dimensions.get('window');

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  image_url: string;
  created_at?: string;
}

export default function ArticleScreen() {
  const { id } = useLocalSearchParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  const mediaUrl = 'http://192.168.6.32:8000/storage/';

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setError(null);
      const response = await articlesApi.getOne(id as string);
      setArticle(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch article');
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this article: ${article?.title}`,
        url: `https://yourdomain.com/article/${id}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error || !article) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Article not found'}</Text>
        <Pressable style={styles.retryButton} onPress={fetchArticle}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1e293b" />
        </Pressable>
        <Pressable onPress={handleShare} style={styles.shareButton}>
          <Share2 size={24} color="#1e293b" />
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        <Image
          source={{ uri: mediaUrl + article.image_url }}
          style={styles.coverImage}
          resizeMode="cover"
        />

        <View style={styles.articleContent}>
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{article.category}</Text>
          </View>

          <Text style={styles.title}>{article.title}</Text>

          <View style={styles.authorSection}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=faces' }}
              style={styles.authorImage}
            />
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{article.author}</Text>
              <View style={styles.articleMeta}>
                <Text style={styles.timeAgo}>{getTimeAgo(article.created_at)}</Text>
                <Text style={styles.dot}>•</Text>
                <View style={styles.readTimeContainer}>
                  <BookOpen size={14} color="#64748b" />
                  <Text style={styles.readTime}>{getReadTime(article.content)}</Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.content}>{article.content}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.actionButton, isLiked && styles.actionButtonActive]}
          onPress={() => setIsLiked(!isLiked)}
        >
          <Heart
            size={24}
            color={isLiked ? '#ef4444' : '#64748b'}
            fill={isLiked ? '#ef4444' : 'none'}
          />
          <Text style={[styles.actionText, isLiked && styles.actionTextActive]}>
            {isLiked ? 'Liked' : 'Like'}
          </Text>
        </Pressable>

      

        <Pressable style={styles.actionButton} onPress={handleShare}>
          <Share2 size={24} color="#64748b" />
          <Text style={styles.actionText}>Share</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
  },
  coverImage: {
    marginTop: 16,
    width: width,
    height: width * 0.75,
  },
  articleContent: {
    padding: 16,
  },
  categoryContainer: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  category: {
    color: '#0284c7',
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
    lineHeight: 32,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  authorImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeAgo: {
    fontSize: 14,
    color: '#64748b',
  },
  dot: {
    fontSize: 14,
    color: '#64748b',
    marginHorizontal: 8,
  },
  readTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTime: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#334155',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  actionButtonActive: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  actionTextActive: {
    color: '#ef4444',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
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
});