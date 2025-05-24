import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  Pressable, 
  ActivityIndicator,
  Alert,
  Image,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { Image as ImageIcon, ArrowLeft, Upload } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { articlesApi } from '../services/api';

export default function AddPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSubmit = async () => {
    if (!title || !content || !category || !author) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      // Create FormData object
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      formData.append('author', author);

      // Append image if selected
      if (imageUri) {
        const filename = imageUri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('image', {
          uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
          name: filename,
          type,
        } as any);
      }

      await articlesApi.create(formData);
      Alert.alert('Success', 'Post created successfully');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
        </Pressable>
        <Text style={styles.headerTitle}>Create New Post</Text>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.imagePreview}>
          {imageUri ? (
            <>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <View style={styles.imageOverlay}>
                <Pressable style={styles.changeImageButton} onPress={pickImage}>
                  <Upload size={20} color="#ffffff" />
                  <Text style={styles.changeImageText}>Change Image</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <Pressable style={styles.uploadArea} onPress={pickImage}>
              <ImageIcon size={48} color="#94a3b8" />
              <Text style={styles.uploadText}>Upload Cover Image</Text>
              <Text style={styles.uploadHint}>Click to browse files</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter post title"
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Content</Text>
          <TextInput
            style={[styles.input, styles.contentInput]}
            value={content}
            onChangeText={setContent}
            placeholder="Write your post content"
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="Enter post category"
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Author</Text>
          <TextInput
            style={styles.input}
            value={author}
            onChangeText={setAuthor}
            placeholder="Enter author name"
            placeholderTextColor="#94a3b8"
          />
        </View>

        <Pressable 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Publish Article</Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#FF4747',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  form: {
    padding: 24,
  },
  imagePreview: {
    position: 'relative',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  previewImage: {
    width: '100%',
    height: 240,
    borderRadius: 16,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  changeImageText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  uploadArea: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 16,
  },
  uploadText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  uploadHint: {
    marginTop: 8,
    fontSize: 14,
    color: '#94a3b8',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contentInput: {
    height: 200,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FF4747',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 40,
    shadowColor: '#FF4747',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});