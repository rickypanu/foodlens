import React, { useEffect, useState, useCallback } from "react";
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
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { api } from "../../services/api";
import { useAuth } from "@/src/context/AuthContext";

/* ---------------- CONSTANTS ---------------- */

const POST_TYPES = [
  "General",
  "Tip",
  "Motivational",
  "Journey",
  "Question",
  "Project",
  "Resource",
];

const IMAGE_ASPECT = [4, 3];
const IMAGE_QUALITY = 0.7;
const MAX_CONTENT_LENGTH = 500;

/* ---------------- MAIN SCREEN ---------------- */

export default function Community() {
  const { userData } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [likingPostId, setLikingPostId] = useState(null);

  // Create post states
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newType, setNewType] = useState("General");
  const [newTags, setNewTags] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
 
  /* ---------------- FETCH POSTS ---------------- */

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts/");
      setPosts(res.data);
    } catch (e) {
      Alert.alert("Error", "Failed to load posts");
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

  /* ---------------- LIKE HANDLER ---------------- */

  const handleLike = async (postId) => {
    const userId = userData?.email;
    if (!userId) {
      Alert.alert("Login Required", "Please login to like posts");
      return;
    }

    if (likingPostId === postId) return;
    setLikingPostId(postId);

    setPosts((prev) =>
      prev.map((p) => {
        if (p._id !== postId) return p;
        const liked = p.liked_by?.includes(userId);
        return {
          ...p,
          liked_by: liked
            ? p.liked_by.filter((id) => id !== userId)
            : [...(p.liked_by || []), userId],
          likes_count: liked ? p.likes_count - 1 : p.likes_count + 1,
        };
      })
    );

    try {
      await api.put(`/posts/${postId}/like`, { user_id: userId });
    } catch {
      fetchPosts();
    } finally {
      setLikingPostId(null);
    }
  };

  /* ---------------- IMAGE PICKER ---------------- */

  const pickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert("Permission Required", "Allow photo access");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: IMAGE_ASPECT,
      quality: IMAGE_QUALITY,
    });

    if (!result.canceled) setSelectedImage(result.assets[0]);
  };

  /* ---------------- CREATE POST ---------------- */

  const handleCreatePost = async () => {
    if (!newContent.trim()) {
      Alert.alert("Error", "Description required");
      return;
    }

    setIsPosting(true);

    try {
      let imageUrl = "";

      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", {
          uri: selectedImage.uri,
          name: "upload.jpg",
          type: "image/jpeg",
        });

        const uploadRes = await api.post("/posts/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadRes.data.file_url;
      }

      const cleanTags = newTags
        .split(",")
        .map((t) => t.replace("#", "").trim())
        .filter(Boolean);

      await api.post("/posts/", {
        user_id: userData?.email || "unknown",
        user_name: userData?.name || "Anonymous",
        type: newType,
        title: newTitle,
        content: newContent,
        image_url: imageUrl,
        tags: cleanTags.join(","),
        is_public: true,
      });

      setNewTitle("");
      setNewContent("");
      setNewTags("");
      setNewType("General");
      setSelectedImage(null);

      fetchPosts();
      Alert.alert("Success", "Post created");
    } catch {
      Alert.alert("Error", "Post failed");
    } finally {
      setIsPosting(false);
    }
  };

  /* ---------------- RENDER ---------------- */

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <CreatePostSection
            {...{
              newTitle,
              setNewTitle,
              newContent,
              setNewContent,
              newTags,
              setNewTags,
              newType,
              setNewType,
              selectedImage,
              setSelectedImage,
              pickImage,
              handleCreatePost,
              isPosting,
            }}
          />
        }
        renderItem={({ item }) => (
          <Post
            {...item}
            isLiked={item.liked_by?.includes(userData?.email)}
            onLike={() => handleLike(item._id)}
            disabled={likingPostId === item._id}
          />
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
      />
    </KeyboardAvoidingView>
  );
}

/* ---------------- POST COMPONENT ---------------- */

const Post = React.memo(
  ({
    user_name,
    created_at,
    content,
    title,
    image_url,
    likes_count,
    type,
    tags,
    isLiked,
    onLike,
    disabled,
  }) => {
    const [imgLoading, setImgLoading] = useState(false);
    const date = new Date(created_at).toLocaleDateString();

    return (
      <View style={styles.post}>
        <Text style={styles.bold}>{user_name}</Text>
        <Text style={styles.muted}>
          {date} · {type}
        </Text>

        {title ? <Text style={styles.postTitle}>{title}</Text> : null}
        <Text>{content}</Text>

        {image_url ? (
          <>
            {imgLoading && <ActivityIndicator style={{ marginVertical: 10 }} />}
            <Image
              source={{ uri: image_url }}
              style={styles.postImage}
              onLoadStart={() => setImgLoading(true)}
              onLoadEnd={() => setImgLoading(false)}
            />
          </>
        ) : null}

        <View style={styles.footer}>
          <Text style={styles.hashTag}>{tags?.map((t) => `#${t} `)}</Text>

          <TouchableOpacity onPress={onLike} disabled={disabled}>
            <Text style={{ fontWeight: isLiked ? "bold" : "normal" }}>
              {isLiked ? "❤️" : "🤍"} {likes_count}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

/* ---------------- CREATE POST UI ---------------- */

function CreatePostSection(props) {
  const {
    newTitle,
    setNewTitle,
    newContent,
    setNewContent,
    newTags,
    setNewTags,
    newType,
    setNewType,
    selectedImage,
    setSelectedImage,
    pickImage,
    handleCreatePost,
    isPosting,
  } = props;
  
 const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <View style={styles.createPost}>
      {/* HEADER ROW */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Create Post</Text>

        <TouchableOpacity
          style={styles.plusBtn}
          onPress={() => setIsCreateOpen((prev) => !prev)}
        >
          <Text style={styles.plusText}>{isCreateOpen ? "✕" : "+"}</Text>
        </TouchableOpacity>
      </View>

      {/* FORM (ONLY WHEN OPEN) */}
      {isCreateOpen && (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {POST_TYPES.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setNewType(t)}
                style={[
                  styles.typeChip,
                  newType === t && styles.activeTypeChip,
                ]}
              >
                <Text style={newType === t && styles.activeTypeText}>{t}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text>Title</Text>
          <TextInput
            placeholder="Title"
            value={newTitle}
            onChangeText={setNewTitle}
            style={styles.input}
          />

          <Text>Content</Text>
          <TextInput
            placeholder="Description"
            value={newContent}
            onChangeText={setNewContent}
            multiline
            maxLength={MAX_CONTENT_LENGTH}
            style={[styles.input, { height: 70 }]}
          />

          <Text>Tags</Text>
          <TextInput
            placeholder="tips,motivation"
            value={newTags}
            onChangeText={setNewTags}
            style={styles.input}
          />

          {selectedImage && (
            <TouchableOpacity onPress={() => setSelectedImage(null)}>
              <Text style={{ color: "red", marginBottom: 8 }}>
                Remove Image
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.actionRow}>
            <TouchableOpacity onPress={pickImage} style={styles.imageBtn}>
              <Text>📷 Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                await handleCreatePost();
                setIsCreateOpen(false); // ✅ AUTO CLOSE AFTER POST
              }}
              disabled={isPosting}
              style={styles.postBtn}
            >
              {isPosting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  plusBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
  },

  plusText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  post: {
    backgroundColor: "#fafafa",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  bold: { fontWeight: "700" },
  muted: { color: "#777", fontSize: 12 },

  postTitle: { fontWeight: "bold", fontSize: 16, marginVertical: 4 },

  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  hashTag: { color: "#3b82f6", fontSize: 12 },

  createPost: {
    backgroundColor: "#f0fdf4",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },

  sectionTitle: { fontWeight: "bold", marginBottom: 10 },

  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },

  activeTypeChip: { backgroundColor: "#10b981" },
  activeTypeText: { color: "#fff" },

  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  imageBtn: {
    backgroundColor: "#e5e7eb",
    padding: 8,
    borderRadius: 8,
  },

  postBtn: {
    backgroundColor: "#10b981",
    padding: 10,
    borderRadius: 8,
  },
});
