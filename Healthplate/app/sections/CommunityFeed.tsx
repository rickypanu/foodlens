import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { Heart, MessageCircle, Share2, MoreHorizontal, Plus } from 'lucide-react-native';

// Sample Data
const POSTS = [
  {
    id: '1',
    user: 'Aarav Sharma',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav',
    content: 'Just finished my first 5km run! Feeling amazing. 🏃‍♂️💨',
    likes: 24,
    comments: 5,
    time: '2h ago',
  },
  {
    id: '2',
    user: 'Priya Patel',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    content: 'Healthy Paneer salad for lunch today. High protein and delicious! 🥗',
    likes: 42,
    comments: 12,
    time: '4h ago',
  },
];

export default function CommunityFeed() {
  const [posts, setPosts] = useState(POSTS);

  const renderPost = ({ item }: { item: typeof POSTS[0] }) => (
    <View className="bg-white mb-4 rounded-2xl p-4 shadow-sm border border-gray-100">
      {/* Post Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Image source={{ uri: item.avatar }} className="w-10 h-10 rounded-full mr-3 bg-gray-100" />
          <View>
            <Text className="font-bold text-gray-900">{item.user}</Text>
            <Text className="text-xs text-gray-500">{item.time}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <MoreHorizontal size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Text className="text-gray-800 leading-relaxed mb-4">
        {item.content}
      </Text>

      {/* Interactions */}
      <View className="flex-row items-center border-t border-gray-50 pt-3 gap-6">
        <TouchableOpacity className="flex-row items-center">
          <Heart size={20} color="#ef4444" />
          <Text className="ml-1 text-gray-600 text-sm">{item.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center">
          <MessageCircle size={20} color="#6b7280" />
          <Text className="ml-1 text-gray-600 text-sm">{item.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center">
          <Share2 size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1">
      {/* Create Post Bar */}
      <View className="bg-white p-4 rounded-2xl mb-4 flex-row items-center border border-gray-100">
        <Image 
          source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User' }} 
          className="w-10 h-10 rounded-full mr-3" 
        />
        <TouchableOpacity className="flex-1 bg-gray-50 rounded-full px-4 py-2 justify-center">
          <Text className="text-gray-400 text-sm">What's on your mind?</Text>
        </TouchableOpacity>
        <TouchableOpacity className="ml-3 p-2 bg-emerald-500 rounded-full">
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}