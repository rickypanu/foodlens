import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Sparkles, Clock, Flame, ChevronRight, UtensilsCrossed } from 'lucide-react-native';

// Sample Data for AI Meal Plan
const DAILY_PLAN = [
  { type: 'Breakfast', dish: 'Oatmeal with Almonds', cals: 320, time: '10 min' },
  { type: 'Lunch', dish: 'Grilled Chicken Salad', cals: 450, time: '15 min' },
  { type: 'Dinner', dish: 'Paneer & Veggie Stir-fry', cals: 380, time: '20 min' },
];

// Sample Data for Trending Recipes
const TRENDING_RECIPES = [
  {
    id: '1',
    title: 'Avocado Toast Deluxe',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=200&auto=format&fit=crop',
    cals: '290',
    protein: '12g'
  },
  {
    id: '2',
    title: 'Berry Smoothie Bowl',
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?q=80&w=200&auto=format&fit=crop',
    cals: '210',
    protein: '8g'
  }
];

export default function PlanAndRecipes() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      
      {/* AI Generator Hero Card */}
      <TouchableOpacity className="bg-emerald-500 rounded-3xl p-5 mb-6 shadow-md overflow-hidden relative">
        <View className="flex-1 pr-16">
          <Text className="text-white font-bold text-xl mb-1">AI Meal Generator</Text>
          <Text className="text-emerald-50 text-sm mb-4">Generate a 7-day personalized plan based on your goals.</Text>
          <View className="bg-white/20 self-start px-3 py-1.5 rounded-full flex-row items-center">
            <Sparkles size={14} color="white" />
            <Text className="text-white text-xs font-bold ml-1">UPGRADE TO PRO</Text>
          </View>
        </View>
        <View className="absolute -right-4 -bottom-4 opacity-20">
            <UtensilsCrossed size={120} color="white" />
        </View>
      </TouchableOpacity>

      {/* Today's Plan Section */}
      <View className="mb-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-gray-900">Today's Schedule</Text>
          <TouchableOpacity>
            <Text className="text-emerald-600 font-semibold text-sm">Full Week</Text>
          </TouchableOpacity>
        </View>

        {DAILY_PLAN.map((meal, index) => (
          <View key={index} className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 flex-row items-center shadow-sm">
            <View className="w-12 h-12 bg-emerald-50 rounded-xl items-center justify-center mr-4">
              <Text className="text-emerald-600 font-bold text-xs">{meal.type[0]}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider">{meal.type}</Text>
              <Text className="text-gray-900 font-bold text-base">{meal.dish}</Text>
              <View className="flex-row mt-1">
                <View className="flex-row items-center mr-3">
                  <Flame size={12} color="#9ca3af" />
                  <Text className="text-gray-400 text-xs ml-1">{meal.cals} kcal</Text>
                </View>
                <View className="flex-row items-center">
                  <Clock size={12} color="#9ca3af" />
                  <Text className="text-gray-400 text-xs ml-1">{meal.time}</Text>
                </View>
              </View>
            </View>
            <ChevronRight size={20} color="#d1d5db" />
          </View>
        ))}
      </View>

      {/* Trending Recipes (Horizontal) */}
      <View className="mb-4">
        <Text className="text-lg font-bold text-gray-900 mb-4">Trending Recipes</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {TRENDING_RECIPES.map((recipe) => (
            <TouchableOpacity key={recipe.id} className="bg-white rounded-3xl mr-4 shadow-sm border border-gray-100 w-48 overflow-hidden">
              <Image source={{ uri: recipe.image }} className="w-full h-32" />
              <View className="p-3">
                <Text className="font-bold text-gray-900 text-sm mb-1" numberOfLines={1}>{recipe.title}</Text>
                <View className="flex-row justify-between">
                    <Text className="text-emerald-600 text-xs font-bold">{recipe.cals} kcal</Text>
                    <Text className="text-gray-400 text-xs">{recipe.protein} Protein</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

    </ScrollView>
  );
}