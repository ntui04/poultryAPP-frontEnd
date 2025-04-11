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
          <Text style={styles.pageTitle}>Manage Posts</Text>
          <Pressable 
            style={styles.addPostButton}
            onPress={() => router.push('/articles/addArticle')}
          >
            <PlusCircle size={24} color="#2563eb" />
            <Text style={styles.addPostText}>Add Post</Text>
          </Pressable>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search posts..."
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 16,
  },
  headerContent: {
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
  },
  addPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#eff6ff',

  },
  addPostText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  postList: {
    padding: 16,
  },
  postListContent: {
    paddingBottom: 16,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  postInfo: {
    flex: 1,
    marginRight: 16,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  postDetails: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#2563eb',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1f2937',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#64748b',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  modalCancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  modalCancelText: {
    color: '#1f2937',
    fontWeight: '600',
  },
  modalDeleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#ef4444',
  },
  modalDeleteText: {
    color: '#fff',
    fontWeight: '600',
  },
});