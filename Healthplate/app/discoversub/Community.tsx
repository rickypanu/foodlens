import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Make sure to install: npx expo install expo-image-picker
import { api } from '../../src/services/api'; 

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New State for creating posts
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts/');
      setPosts(res.data);
    } catch (error) {
      console.error('Error fetching posts:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 1. Function to Pick Image
  const pickImage = async () => {
    // Request permission first
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  // 2. Function to Create Post
  const handleCreatePost = async () => {
    if (!newContent.trim()) {
      Alert.alert("Error", "Please add a description.");
      return;
    }

    setIsPosting(true);

    try {
      let imageUrl = "";

      // A. Upload Image if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', {
          uri: selectedImage.uri,
          name: 'upload.jpg', // You can generate dynamic names if needed
          type: 'image/jpeg',
        });

        // Ensure your API client handles multipart/form-data automatically 
        // or set headers manually if using standard fetch
        const uploadRes = await api.post('/posts/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        imageUrl = uploadRes.data.file_url;
      }

      // B. Create Post Payload matching your Python Pydantic Model
      const postData = {
        user_id: "user_123_placeholder", // REPLACE with actual user ID from Auth
        user_name: "Engineering Student", // REPLACE with actual name
        type: "general",
        title: newTitle,
        content: newContent,
        image_url: imageUrl,
        tags: "community, update", // Default tag or add an input for this
        is_public: true
      };

      // C. Send to Backend
      await api.post('/posts/', postData);

      // D. Cleanup and Refresh
      setNewTitle('');
      setNewContent('');
      setSelectedImage(null);
      fetchPosts(); // Refresh list
      Alert.alert("Success", "Post created successfully!");

    } catch (error) {
      console.error("Post Error:", error);
      Alert.alert("Error", "Could not create post.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#fff' }}>
      <TouchableOpacity style={styles.shareBtn} onPress={fetchPosts}>
        <Text style={styles.shareText}>↻ Refresh Feed</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#10b981" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Post
              name={item.user_name}
              date={formatDate(item.created_at)}
              text={item.content}
              title={item.title}
              image={item.image_url}
              likes={item.likes_count}
            />
          )}
          style={{ marginBottom: 16 }}
        />
      )}

      {/* CREATE POST SECTION */}
      <View style={styles.createPost}>
        <Text style={styles.sectionTitle}>Create a Post</Text>
        
        <TextInput 
          placeholder="Title (Optional)" 
          style={styles.input} 
          value={newTitle}
          onChangeText={setNewTitle}
        />
        
        <TextInput
          placeholder="What's on your mind?"
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
          multiline
          value={newContent}
          onChangeText={setNewContent}
        />

        {selectedImage && (
          <View style={{ marginBottom: 10 }}>
            <Image source={{ uri: selectedImage.uri }} style={{ width: 100, height: 100, borderRadius: 8 }} />
            <TouchableOpacity onPress={() => setSelectedImage(null)}>
              <Text style={{ color: 'red', fontSize: 12 }}>Remove Image</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
            <Text>📷 Add Image</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.postBtn, isPosting && { opacity: 0.7 }]} 
            onPress={handleCreatePost}
            disabled={isPosting}
          >
            {isPosting ? <ActivityIndicator color="#fff" size="small"/> : <Text style={styles.postBtnText}>Post</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function Post({ name, date, text, title, image, likes }) {
  return (
    <View style={styles.post}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder} />
        <View>
            <Text style={styles.bold}>{name}</Text>
            <Text style={styles.muted}>{date}</Text>
        </View>
      </View>
      
      {title ? <Text style={styles.postTitle}>{title}</Text> : null}
      <Text style={styles.postText}>{text}</Text>
      
      {image ? (
        <Image 
          source={{ uri: image }} 
          style={styles.postImage} 
          resizeMode="cover"
        />
      ) : null}

      <Text style={styles.likes}>❤️ {likes} Likes</Text>
    </View>
  );
}

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toDateString();
};

const styles = StyleSheet.create({
  shareBtn: {
    backgroundColor: "#10b981",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'flex-start'
  },
  shareText: { color: "#fff", fontWeight: "600" },
  post: {
    backgroundColor: "#fafafa",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee'
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatarPlaceholder: { width: 35, height: 35, borderRadius: 20, backgroundColor: '#ddd', marginRight: 10 },
  muted: { color: "#777", fontSize: 12 },
  bold: { fontWeight: "700", fontSize: 14 },
  postTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 4, marginTop: 4 },
  postText: { fontSize: 14, color: '#333', lineHeight: 20, marginBottom: 8 },
  postImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10, marginTop: 5 },
  likes: { color: "#555", fontSize: 13, marginTop: 5 },
  
  // Create Post Styles
  createPost: {
    backgroundColor: "#f0fdf4", // Light green tint
    padding: 14,
    borderRadius: 14,
    marginTop: 'auto', // Pushes to bottom if flex is used
    borderTopWidth: 1,
    borderColor: '#ddd'
  },
  sectionTitle: { fontWeight: 'bold', marginBottom: 10, color: '#333' },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  imageBtn: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  postBtn: {
    backgroundColor: "#10b981",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  postBtnText: { color: '#fff', fontWeight: 'bold' }
});