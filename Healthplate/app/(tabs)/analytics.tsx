import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";
import { Flame, Beef, Wheat, AlertTriangle, TrendingUp, Zap } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

// --- Mock Data for Native Charts ---
const barData = [
  { value: 2100, label: 'M', frontColor: '#3b82f6' },
  { value: 1950, label: 'T', frontColor: '#3b82f6' },
  { value: 2400, label: 'W', frontColor: '#3b82f6' },
  { value: 1800, label: 'T', frontColor: '#3b82f6' },
  { value: 2200, label: 'F', frontColor: '#3b82f6' },
  { value: 2600, label: 'S', frontColor: '#3b82f6' },
  { value: 2050, label: 'S', frontColor: '#3b82f6' },
];

const pieData = [
  { value: 30, color: '#ef4444', text: '30%' },
  { value: 45, color: '#f59e0b', text: '45%' },
  { value: 25, color: '#eab308', text: '25%' },
];

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<'today' | 'trends'>('today');

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Header */}
      <View className="p-6 bg-white border-b border-gray-100 pt-12">
        <Text className="text-2xl font-bold text-gray-900">Health Analytics</Text>
        <Text className="text-gray-500 text-sm">Real-time tracking & predictions</Text>
      </View>

      {/* Tab Selector */}
      <View className="flex-row p-4 gap-4">
        <TouchableOpacity 
          onPress={() => setActiveTab('today')}
          className={`flex-1 py-3 rounded-2xl items-center ${activeTab === 'today' ? 'bg-blue-600 shadow-lg' : 'bg-white border border-gray-200'}`}
        >
          <Text className={`font-bold ${activeTab === 'today' ? 'text-white' : 'text-gray-500'}`}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveTab('trends')}
          className={`flex-1 py-3 rounded-2xl items-center ${activeTab === 'trends' ? 'bg-blue-600 shadow-lg' : 'bg-white border border-gray-200'}`}
        >
          <Text className={`font-bold ${activeTab === 'trends' ? 'text-white' : 'text-gray-500'}`}>Trends</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'today' ? (
        <View className="px-4 space-y-4">
          {/* Metric Grid */}
          <View className="flex-row flex-wrap justify-between">
             <MetricBox label="Cals" value="2100" target="2250" icon={<Flame size={18} color="#f97316"/>} color="bg-orange-50" />
             <MetricBox label="Protein" value="142g" target="150g" icon={<Beef size={18} color="#ef4444"/>} color="bg-red-50" />
          </View>

          {/* Macro Pie Chart Card */}
          <View className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm items-center mt-4">
            <Text className="font-bold text-gray-900 self-start mb-6">Macro Distribution</Text>
            <PieChart
              donut
              radius={80}
              innerRadius={60}
              data={pieData}
              centerLabelComponent={() => (
                <View className="items-center justify-center">
                  <Text className="text-xl font-bold text-gray-900">80%</Text>
                  <Text className="text-[10px] text-gray-500 uppercase">Score</Text>
                </View>
              )}
            />
            <View className="flex-row justify-around w-full mt-6">
               <LegendItem color="#ef4444" label="Protein" />
               <LegendItem color="#f59e0b" label="Carbs" />
               <LegendItem color="#eab308" label="Fat" />
            </View>
          </View>
        </View>
      ) : (
        <View className="px-4">
          {/* Weekly Bar Chart Card */}
          <View className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
            <Text className="font-bold text-gray-900 mb-6">Weekly Calorie Trend</Text>
            <BarChart
              data={barData}
              barWidth={22}
              noOfSections={3}
              barBorderRadius={4}
              frontColor="lightgray"
              yAxisThickness={0}
              xAxisThickness={0}
              hideRules
              labelTextStyle={{color: 'gray', fontSize: 12}}
            />
          </View>
          
          {/* Prediction Insight */}
          <View className="mt-6 bg-purple-600 p-5 rounded-3xl shadow-lg">
            <View className="flex-row items-center gap-2 mb-2">
              <TrendingUp color="white" size={20} />
              <Text className="text-white font-bold text-lg">AI Prediction</Text>
            </View>
            <Text className="text-purple-100 leading-5">
              Consistent protein intake detected. You are projected to hit your muscle retention goal in <Text className="font-bold text-white">12 days</Text>.
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// --- Helper Components ---

function MetricBox({ label, value, target, icon, color }: any) {
  return (
    <View style={{ width: screenWidth * 0.44 }} className="bg-white p-4 rounded-3xl border border-gray-100 mb-4 shadow-sm">
      <View className={`w-10 h-10 rounded-2xl ${color} items-center justify-center mb-3`}>{icon}</View>
      <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">{label}</Text>
      <Text className="text-xl font-bold text-gray-900">{value}</Text>
      <Text className="text-gray-400 text-[10px]">Goal: {target}</Text>
    </View>
  );
}

function LegendItem({ color, label }: any) {
  return (
    <View className="flex-row items-center gap-2">
      <View className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <Text className="text-xs text-gray-500 font-medium">{label}</Text>
    </View>
  );
}