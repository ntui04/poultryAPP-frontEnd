import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Modal, Alert } from 'react-native';
import { router } from 'expo-router';
import { Edit, Trash2, PlusCircle, Search } from 'lucide-react-native';

export default function ManagePosts() {
  const [posts, setPosts] = useState([
    {
      id: '1',
      title: 'Poultry Vaccination Guide',
      author: 'Dr. Sarah Wilson',
      date: 'March 15, 2024',
      status: 'Published'
    },
    {
      id: '2',
      title: 'Nutrition Tips for Laying Hens',
      author: 'Dr. John Carter',
      date: 'February 22, 2024',
      status: 'Draft'
    },
    {
      id: '3',
      title: 'Preventing Avian Diseases',
      author: 'Dr. Emily Chen',
      date: 'January 10, 2024',
      status: 'Published'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const handleDelete = () => {
    if (selectedPost) {
      setPosts(posts.filter(post => post.id !== selectedPost.id));
      setIsDeleteModalVisible(false);
      setSelectedPost(null);
      Alert.alert('Success', 'Post deleted successfully');
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPostItem = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postInfo}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postDetails}>
          By {item.author} | {item.date}
        </Text>
        <Text style={[
          styles.statusBadge, 
          item.status === 'Published' ? styles.publishedStatus : styles.draftStatus
        ]}>
          {item.status}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        <Pressable 
          style={styles.editButton}
          onPress={() => router.push(`/posts/edit/${item.id}`)}
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.pageTitle}>Manage Posts</Text>
          <Pressable 
            style={styles.addPostButton}
            onPress={() => router.push('/posts/add')}
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
          />
        </View>
      </View>

      <FlatList
        data={filteredPosts}
        renderItem={renderPostItem}
        keyExtractor={item => item.id}
        style={styles.postList}
        contentContainerStyle={styles.postListContent}
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
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 16,
  },
  headerContent: {
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
    gap: 8,
  },
  addPostText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
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
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
  },
  publishedStatus: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  draftStatus: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
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