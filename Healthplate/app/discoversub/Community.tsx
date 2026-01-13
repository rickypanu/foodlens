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
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView // Import ScrollView for the horizontal tags
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../../src/services/api'; 
import { useAuth } from '@/src/context/AuthContext';

// --- CONFIGURATION ---
const POST_TYPES = ["General", "Tip", "Motivational", "Journey", "Question", "Project", "Resource"];

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userData } = useAuth();

  // Input States
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState('General'); // Default selected
  const [newTags, setNewTags] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  // Fetch Posts
  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts/');
      setPosts(res.data);
    } catch (error) {
      console.error('Error fetching posts:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  // Handle Like

  const handleLike = async (postId) => {
    // 1. Safety Check: Is User Logged In?
    // Use optional chaining (?.) to prevent crash if userData is null
    const currentUserId = userData?.email; 
    
    if (!currentUserId) {
      Alert.alert("Login Required", "You need to be logged in to like posts.");
      return;
    }

    // 2. Safety Check: Find the post
    const targetPost = posts.find(p => p._id === postId);
    
    if (!targetPost) {
      console.error("Error: Post not found in state for ID:", postId);
      return; // Stop function to prevent crash
    }

    // 3. Safety Check: Ensure liked_by is always an array
    // If backend sends null/undefined, default to []
    const currentLikedBy = targetPost.liked_by || []; 
    const isLiked = currentLikedBy.includes(currentUserId);

    // 4. Optimistic Update (Update UI instantly)
    setPosts(currentPosts => 
      currentPosts.map(post => {
        if (post._id === postId) {
          // Calculate new list safely
          let newLikedBy;
          if (isLiked) {
             // Unlike: Remove user
             newLikedBy = (post.liked_by || []).filter(id => id !== currentUserId);
          } else {
             // Like: Add user
             newLikedBy = [...(post.liked_by || []), currentUserId];
          }

          return {
            ...post,
            likes_count: isLiked ? Math.max(0, post.likes_count - 1) : post.likes_count + 1,
            liked_by: newLikedBy
          };
        }
        return post;
      })
    );

    // 5. API Call
    try {
      await api.put(`/posts/${postId}/like`, { user_id: currentUserId });
      console.log("Server updated like status");
    } catch (error) {
      console.error("Like API failed:", error);
      Alert.alert("Connection Error", "Could not update like status.");
      fetchPosts(); // Revert changes if server fails
    }
  };


  // Pick Image
  const pickImage = async () => {
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

  // Create Post
  const handleCreatePost = async () => {
    if (!newContent.trim()) {
      Alert.alert("Error", "Please add a description.");
      return;
    }

    setIsPosting(true);

    try {
      let imageUrl = "";

      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', {
          uri: selectedImage.uri,
          name: 'upload.jpg',
          type: 'image/jpeg',
        });

        const uploadRes = await api.post('/posts/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        imageUrl = uploadRes.data.file_url;
      }

      const postData = {
        user_id: userData?.email || "unknown_id",
        user_name: userData?.name || "Anonymous",
        type: newType, // Uses the selected chip
        title: newTitle,
        content: newContent,
        image_url: imageUrl,
        tags: newTags,
        is_public: true
      };

      await api.post('/posts/', postData);

      // Cleanup
      setNewTitle('');
      setNewContent('');
      setNewTags('');
      setNewType('General'); // Reset to default
      setSelectedImage(null);
      
      fetchPosts(); 
      Alert.alert("Success", "Post created successfully!");

    } catch (error) {
      console.error("Post Error:", error);
      Alert.alert("Error", "Could not create post.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#fff' }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80} 
    >
      <View style={{ flex: 1, padding: 16 }}>
        
        {loading ? (
          <ActivityIndicator size="large" color="#10b981" style={{marginTop: 20}} />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item._id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#10b981"]} />
            }
            renderItem={({ item }) => (
              <Post
                id={item._id}
                name={item.user_name}
                date={item.created_at}
                text={item.content}
                title={item.title}
                image={item.image_url}
                likes={item.likes_count}
                type={item.type}
                tags={item.tags}
                isLiked={item.liked_by?.includes(userData?.email)} 
                onLike={() => handleLike(item._id)}
              />
            )}
            style={{ marginBottom: 16 }}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}

        {/* CREATE POST SECTION */}
        <View style={styles.createPost}>
          <Text style={styles.sectionTitle}>Create a Post</Text>
          
          {/* 1. NEW: Horizontal Scroll for Type Selection */}
          <View style={{ marginBottom: 10 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {POST_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setNewType(type)}
                  style={[
                    styles.typeChip,
                    newType === type && styles.activeTypeChip
                  ]}
                >
                  <Text style={[
                    styles.typeText,
                    newType === type && styles.activeTypeText
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <TextInput 
            placeholder="Title (Optional)" 
            style={styles.input} 
            value={newTitle}
            onChangeText={setNewTitle}
          />
          
          <TextInput
            placeholder="What's on your mind?"
            style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
            multiline
            value={newContent}
            onChangeText={setNewContent}
          />

          <TextInput 
              placeholder="Tags (comma separated: python, react)" 
              style={styles.input} 
              value={newTags}
              onChangeText={setNewTags}
            />

          {selectedImage && (
            <View style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
              <Image source={{ uri: selectedImage.uri }} style={{ width: 50, height: 50, borderRadius: 8, marginRight: 10 }} />
              <TouchableOpacity onPress={() => setSelectedImage(null)}>
                <Text style={{ color: 'red', fontSize: 12 }}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
              <Text>📷 Photo</Text>
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
    </KeyboardAvoidingView>
  );
}
function Post({ id, name, date, text, title, image, likes, type, tags, isLiked, onLike }) {
  const formattedDate = new Date(date).toLocaleDateString();

  return (
    <View style={styles.post}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder} />
        <View>
            <Text style={styles.bold}>{name}</Text>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text style={styles.muted}>{formattedDate}</Text>
              {/* Badge for Type in the Post Header */}
              <View style={styles.postTypeBadge}>
                <Text style={styles.postTypeText}>{type}</Text>
              </View>
            </View>
        </View>
      </View>
      
      {title ? <Text style={styles.postTitle}>{title}</Text> : null}
      <Text style={styles.postText}>{text}</Text>
      
      {image && image !== "" ? (
        <Image 
          source={{ uri: image }} 
          style={styles.postImage} 
          resizeMode="cover"
        />
      ) : null}

      <View style={styles.footer}>
          <View style={styles.tagRow}>
            {tags && tags.map((tag, index) => (
                <Text key={index} style={styles.hashTag}>#{tag} </Text>
            ))}
          </View>
         <TouchableOpacity 
            style={styles.likeBtn} 
            onPress={onLike}
          >
            <Text style={{fontSize: 16, fontWeight: isLiked ? 'bold' : 'normal'}}>
              {isLiked ? "❤️" : "🤍"} {likes}
            </Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... Same styles as before ...
  post: {
    backgroundColor: "#fafafa",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatarPlaceholder: { width: 35, height: 35, borderRadius: 20, backgroundColor: '#ddd', marginRight: 10 },
  muted: { color: "#777", fontSize: 12 },
  bold: { fontWeight: "700", fontSize: 14 },
  
  // NEW STYLES FOR POST TYPE BADGE
  postTypeBadge: { 
    backgroundColor: '#e0f2fe', 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 4, 
    marginLeft: 8 
  },
  postTypeText: { fontSize: 10, color: '#0ea5e9', fontWeight: 'bold' },

  postTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 4, marginTop: 4 },
  postText: { fontSize: 14, color: '#333', lineHeight: 20, marginBottom: 8 },
  postImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10, marginTop: 5, backgroundColor: '#eee' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', maxWidth: '75%' },
  hashTag: { color: "#3b82f6", fontSize: 12 },
  likeBtn: { padding: 5 },

  // Create Post Styles
  createPost: {
    backgroundColor: "#f0fdf4", 
    padding: 14,
    borderRadius: 14,
    borderTopWidth: 1,
    borderColor: '#ddd'
  },
  sectionTitle: { fontWeight: 'bold', marginBottom: 10, color: '#333' },
  
  // NEW STYLES FOR TYPE SELECTION CHIPS
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  activeTypeChip: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  typeText: { fontSize: 12, color: '#555' },
  activeTypeText: { color: '#fff', fontWeight: 'bold' },

  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 14
  },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  imageBtn: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  postBtn: {
    backgroundColor: "#10b981",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  postBtnText: { color: '#fff', fontWeight: 'bold' }
});