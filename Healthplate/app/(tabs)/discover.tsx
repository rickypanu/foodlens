import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Users, Utensils, Zap } from 'lucide-react-native';

// --- IMPORTANT: Component Imports ---
// Make sure these files exist in your /sections folder!
import PlanAndRecipes from '../sections/PlanAndRecipes';
import NutritionGuide from '../sections/NutritionGuide';
import CommunityFeed from '../sections/CommunityFeed';

export default function Discover() {
  const [activeTab, setActiveTab] = useState('plans');

  const tabs = [
    { id: 'plans', label: 'Plans', icon: Utensils },
    { id: 'nutrition', label: 'Guide', icon: Zap },
    { id: 'community', label: 'Social', icon: Users },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1 px-4" 
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]} // Keeps the tab bar visible while scrolling
      >
        {/* Page Header */}
        <View className="py-6">
          <Text className="text-3xl font-bold text-gray-900">Discover</Text>
          <Text className="text-gray-500 mt-1">Explore plans, nutrition, and community.</Text>
        </View>

        {/* Custom Tab Header */}
        <View className="flex-row bg-white rounded-2xl p-1 mb-6 border border-gray-100 shadow-sm">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.8}
              className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${
                activeTab === tab.id ? 'bg-emerald-500 shadow-sm' : ''
              }`}
            >
              <tab.icon size={18} color={activeTab === tab.id ? 'white' : '#6b7280'} />
              <Text className={`ml-2 font-bold ${activeTab === tab.id ? 'text-white' : 'text-gray-500'}`}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Conditional Content Area */}
        <View className="pb-10">
          {activeTab === 'plans' && <PlanAndRecipes />}
          {activeTab === 'nutrition' && <NutritionGuide />}
          {activeTab === 'community' && <CommunityFeed />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}