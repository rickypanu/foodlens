import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Leaf, Flame, Activity, Brain, ChevronRight } from 'lucide-react-native';

const GUIDES = [
  {
    title: "Protein Mastery",
    desc: "Why 1.6g/kg is the sweet spot for muscle retention.",
    color: "bg-blue-50",
    textColor: "text-blue-600",
    icon: Activity
  },
  {
    title: "The Fibre Rule",
    desc: "Aim for 30g daily to improve gut health and satiety.",
    color: "bg-emerald-50",
    textColor: "text-emerald-600",
    icon: Leaf
  },
  {
    title: "Micronutrient Density",
    desc: "How to hit your Iron and B12 targets on a veg diet.",
    color: "bg-purple-50",
    textColor: "text-purple-600",
    icon: Brain
  }
];

export default function NutritionGuide() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      {/* Knowledge Cards */}
      <View className="space-y-4">
        {GUIDES.map((guide, i) => (
          <TouchableOpacity 
            key={i} 
            activeOpacity={0.7}
            className="bg-white p-4 rounded-3xl flex-row items-center border border-gray-100 shadow-sm mb-3"
          >
            <View className={`p-3 rounded-2xl ${guide.color}`}>
              <guide.icon size={24} color={guide.textColor === 'text-blue-600' ? '#2563eb' : guide.textColor === 'text-emerald-600' ? '#059669' : '#7c3aed'} />
            </View>
            
            <View className="flex-1 ml-4">
              <Text className="font-bold text-gray-900 text-base">{guide.title}</Text>
              <Text className="text-sm text-gray-500 mt-1 leading-4">{guide.desc}</Text>
            </View>

            <ChevronRight size={18} color="#d1d5db" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Pro Tip Section */}
      <View className="mt-6">
        <View className="flex-row items-center gap-2 mb-3">
          <Flame size={20} color="#f97316" />
          <Text className="text-lg font-bold text-gray-900">Quick Health Bites</Text>
        </View>
        
        <View className="bg-orange-50 rounded-3xl p-5 border border-orange-100">
          <Text className="text-orange-900 text-sm leading-6">
            <Text className="font-bold text-orange-600 italic">Pro Tip: </Text>
            Consuming Vitamin C (like lemon juice) with iron-rich meals (like spinach or lentils) can increase iron absorption by up to <Text className="font-bold">300%</Text>.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}