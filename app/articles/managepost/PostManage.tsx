import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Pressable, 
  TextInput, 
  Modal, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { router } from 'expo-router';
import { CreditCard as Edit, Trash2, CirclePlus as PlusCircle, Search } from 'lucide-react-native';
import { articlesApi } from '../../services/api';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  image_url: string;
  created_at?: string;
}

export default function ManagePosts() {
  const [posts, setPosts] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Article | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await articlesApi.getAllByConsultant(); // 👈 for consultant's own posts
      setPosts(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
      Alert.alert('Error', 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async () => {
    if (selectedPost) {
      try {
        await articlesApi.delete(selectedPost.id);
        setPosts(posts.filter(post => post.id !== selectedPost.id));
        setIsDeleteModalVisible(false);
        setSelectedPost(null);
        Alert.alert('Success', 'Post deleted successfully');
      } catch (err: any) {
        Alert.alert('Error', err.response?.data?.message || 'Failed to delete post');
      }
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderPostItem = ({ item }: { item: Article }) => (
    <View style={styles.postCard}>
      <View style={styles.postInfo}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postDetails}>
          By {item.author} | {formatDate(item.created_at)}
        </Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
      <View style={styles.actionButtons}>
        <Pressable 
          style={styles.editButton}
          onPress={() => router.push(`/articles/edit/${item.id}`)}
        >
          <Edit size={20} color="#2563eb" />
        </Pressable>
        <Pressable 
          style={styles.deleteButton}
          onPress={() => {
            setSelectedPost(item);
            setIsDeleteModalVisible(true);
          }}
        >
          <Trash2 size={20} color="#ef4444" />
        </Pressable>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchPosts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.pageTitle}>My Articles</Text>
          <Pressable 
            style={styles.addPostButton}
            onPress={() => router.push('/articles/addArticle')}
          >
            <PlusCircle size={24} color="#ffffff" />
            <Text style={styles.addPostText}>New Article</Text>
          </Pressable>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your articles..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      <FlatList
        data={filteredPosts}
        renderItem={renderPostItem}
        keyExtractor={item => item.id}
        style={styles.postList}
        contentContainerStyle={styles.postListContent}
        refreshing={loading}
        onRefresh={fetchPosts}
      />

      <Modal
        visible={isDeleteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete the post "{selectedPost?.title}"?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable 
                style={styles.modalCancelButton}
                onPress={() => setIsDeleteModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable 
                style={styles.modalDeleteButton}
                onPress={handleDelete}
              >
                <Text style={styles.modalDeleteText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#FF4747',
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
  },
  addPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  addPostText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 12,
    marginBottom: -24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  postList: {
    paddingTop: 36,
  },
  postListContent: {
    padding: 24,
  },
  postCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  postInfo: {
    flex: 1,
    marginRight: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  postDetails: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  category: {
    fontSize: 13,
    color: '#FF4747',
    backgroundColor: '#fff2f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editButton: {
    padding: 10,
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1f2937',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#64748b',
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '600',
  },
  modalDeleteButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FF4747',
    alignItems: 'center',
  },
  modalDeleteText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  }
});