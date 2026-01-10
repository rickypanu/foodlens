import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
} from 'react-native';
import { api } from '../../src/services/api'; // adjust path

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <View style={{ padding: 16 }}>
      <TouchableOpacity style={styles.shareBtn}>
        <Text style={styles.shareText}>+ Share Your Journey</Text>
      </TouchableOpacity>

      {loading ? (
        <Text>Loading posts...</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Post
              name={item.user_name}
              date={formatDate(item.created_at)}
              text={item.content}
              likes={item.likes_count}
            />
          )}
        />
      )}

      <View style={styles.createPost}>
        <TextInput placeholder="Title" style={styles.input} />
        <TextInput
          placeholder="Description"
          style={[styles.input, { height: 80 }]}
          multiline
        />
        <TouchableOpacity style={styles.imageBtn}>
          <Text>Add Image</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Post({ name, date, text, likes }) {
  return (
    <View style={styles.post}>
      <Text style={styles.bold}>{name}</Text>
      <Text style={styles.muted}>{date}</Text>
      <Text style={{ marginVertical: 8 }}>{text}</Text>
      <Text>❤️ {likes}</Text>
    </View>
  );
}

// Safe date formatter
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toDateString();
};

const styles = StyleSheet.create({
  shareBtn: {
    backgroundColor: "#10b981",
    padding: 14,
    borderRadius: 14,
    marginBottom: 16
  },
  shareText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center"
  },
  post: {
    backgroundColor: "#fafafa",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12
  },
  muted: {
    color: "#777",
    fontSize: 12
  },
  bold: {
    fontWeight: "700"
  },
  createPost: {
    backgroundColor: "#f6f6f6",
    padding: 14,
    borderRadius: 14,
    marginTop: 16
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8
  },
  imageBtn: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 10,
    alignItems: "center"
  }
});
