import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { BarChart, PieChart } from "react-native-gifted-charts";
import { Flame, Beef, Wheat, Droplets, TrendingUp, ChevronRight, Activity, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

// --- Mock Data ---
const barData = [
  { value: 2100, label: 'M', frontColor: '#6366f1', gradientColor: '#818cf8', spacing: 20 },
  { value: 1950, label: 'T', frontColor: '#6366f1', gradientColor: '#818cf8', spacing: 20 },
  { value: 2400, label: 'W', frontColor: '#6366f1', gradientColor: '#818cf8', spacing: 20 },
  { value: 1800, label: 'T', frontColor: '#c7d2fe', gradientColor: '#e0e7ff', spacing: 20 }, // Low day
  { value: 2200, label: 'F', frontColor: '#6366f1', gradientColor: '#818cf8', spacing: 20 },
  { value: 2600, label: 'S', frontColor: '#4f46e5', gradientColor: '#4338ca', spacing: 20 }, // High day
  { value: 2050, label: 'S', frontColor: '#6366f1', gradientColor: '#818cf8', spacing: 20 },
];

const pieData = [
  { value: 30, color: '#6366f1', text: '30%', focused: true }, // Protein
  { value: 45, color: '#f59e0b', text: '45%' }, // Carbs
  { value: 25, color: '#10b981', text: '25%' }, // Fat
];

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<'today' | 'trends'>('today');

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View className="px-6 py-4 flex-row justify-between items-center bg-white border-b border-gray-50 pb-6">
          <View>
            <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Overview</Text>
            <Text className="text-2xl font-extrabold text-slate-900">Health Pulse</Text>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-indigo-50 rounded-full items-center justify-center border border-indigo-100">
            <Calendar size={20} color="#4f46e5" />
          </TouchableOpacity>
        </View>

        {/* Custom Tab Switcher */}
        <View className="mx-6 mt-6 p-1 bg-gray-200/50 rounded-2xl flex-row h-14 items-center">
          <TabButton 
            title="Today" 
            isActive={activeTab === 'today'} 
            onPress={() => setActiveTab('today')} 
          />
          <TabButton 
            title="Trends" 
            isActive={activeTab === 'trends'} 
            onPress={() => setActiveTab('trends')} 
          />
        </View>

        {activeTab === 'today' ? (
          <View className="px-6 mt-6 space-y-6">
            
            {/* Hero Card: Calories */}
            <LinearGradient
              colors={['#4f46e5', '#6366f1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-6 rounded-[28px] shadow-lg shadow-indigo-200"
            >
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="text-indigo-100 font-medium mb-1">Calories Remaining</Text>
                  <Text className="text-4xl font-bold text-white">450 <Text className="text-lg text-indigo-200">kcal</Text></Text>
                </View>
                <View className="bg-white/20 p-2 rounded-xl">
                  <Flame size={24} color="white" fill="white" />
                </View>
              </View>
              
              {/* Custom Progress Bar inside Hero */}
              <View className="mt-6">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-indigo-100 text-xs font-medium">Eaten: 2,100</Text>
                  <Text className="text-indigo-100 text-xs font-medium">Goal: 2,550</Text>
                </View>
                <View className="h-3 bg-black/20 rounded-full overflow-hidden">
                  <View style={{ width: '82%' }} className="h-full bg-white rounded-full" />
                </View>
              </View>
            </LinearGradient>

            {/* Metrics Grid */}
            <View className="flex-row flex-wrap justify-between">
               <MetricCard 
                  label="Protein" 
                  value="142g" 
                  subValue="/ 150g" 
                  percent={94} 
                  color="bg-indigo-50" 
                  barColor="bg-indigo-500"
                  icon={<Beef size={20} color="#4f46e5" />} 
                />
               <MetricCard 
                  label="Carbs" 
                  value="210g" 
                  subValue="/ 250g" 
                  percent={84} 
                  color="bg-amber-50" 
                  barColor="bg-amber-500"
                  icon={<Wheat size={20} color="#d97706" />} 
                />
               <MetricCard 
                  label="Fats" 
                  value="65g" 
                  subValue="/ 70g" 
                  percent={92} 
                  color="bg-emerald-50" 
                  barColor="bg-emerald-500"
                  icon={<Activity size={20} color="#059669" />} 
                />
               <MetricCard 
                  label="Water" 
                  value="1.2L" 
                  subValue="/ 2.5L" 
                  percent={48} 
                  color="bg-blue-50" 
                  barColor="bg-blue-500"
                  icon={<Droplets size={20} color="#2563eb" />} 
                />
            </View>

            {/* Macro Breakdown */}
            <View className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm">
              <Text className="font-bold text-lg text-slate-800 mb-6">Macro Balance</Text>
              <View className="items-center">
                <PieChart
                  data={pieData}
                  donut
                  radius={100}
                  innerRadius={75}
                  innerCircleColor={'#fff'}
                  centerLabelComponent={() => (
                    <View className="items-center justify-center">
                      <Text className="text-3xl font-bold text-slate-800">82%</Text>
                      <Text className="text-xs text-gray-400 font-medium">Balanced</Text>
                    </View>
                  )}
                />
              </View>
              {/* Custom Legend */}
              <View className="flex-row justify-center gap-6 mt-8">
                 <LegendDot color="#6366f1" label="Protein" value="30%" />
                 <LegendDot color="#f59e0b" label="Carbs" value="45%" />
                 <LegendDot color="#10b981" label="Fats" value="25%" />
              </View>
            </View>

          </View>
        ) : (
          <View className="px-6 mt-6 space-y-6">
            
            {/* AI Insight Card */}
            <LinearGradient
               colors={['#7c3aed', '#a855f7']}
               start={{ x: 0, y: 0 }}
               end={{ x: 1, y: 0 }}
               className="p-5 rounded-2xl flex-row items-center shadow-lg shadow-purple-200"
            >
              <View className="w-12 h-12 bg-white/20 rounded-xl items-center justify-center mr-4">
                <TrendingUp color="white" size={24} />
              </View>
              <View className="flex-1">
                <Text className="text-purple-100 text-xs font-bold uppercase mb-1">AI Prediction</Text>
                <Text className="text-white font-medium leading-5">
                  You're crushing it! Projected to hit your goal in <Text className="font-bold underline">12 days</Text>.
                </Text>
              </View>
            </LinearGradient>

            {/* Weekly Chart */}
            <View className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm">
              <View className="flex-row justify-between items-center mb-8">
                <View>
                  <Text className="font-bold text-lg text-slate-800">Weekly Activity</Text>
                  <Text className="text-gray-400 text-xs mt-1">Avg. 2150 kcal</Text>
                </View>
                <View className="bg-gray-50 px-3 py-1.5 rounded-lg">
                  <Text className="text-gray-500 text-xs font-medium">Last 7 Days</Text>
                </View>
              </View>

              <BarChart
                data={barData}
                barWidth={28}
                noOfSections={3}
                barBorderTopLeftRadius={8}
                barBorderTopRightRadius={8}
                frontColor="#6366f1"
                showGradient
                gradientColor="#818cf8"
                yAxisThickness={0}
                xAxisThickness={0}
                yAxisTextStyle={{ color: '#94a3b8', fontSize: 11 }}
                xAxisLabelTextStyle={{ color: '#64748b', fontSize: 12, fontWeight: '600' }}
                rulesColor="#f1f5f9"
                rulesType="dashed"
                dashGap={6}
                hideYAxisText={false}
              />
            </View>
            
            {/* Simple List Item for history */}
            <View className="bg-white rounded-3xl p-4 border border-gray-100">
                <Text className="font-bold text-lg text-slate-800 mb-4 px-2">Recent Logs</Text>
                {[1,2,3].map((_, i) => (
                    <TouchableOpacity key={i} className="flex-row items-center justify-between p-3 mb-2 bg-gray-50 rounded-2xl">
                        <View className="flex-row items-center gap-3">
                            <View className="w-10 h-10 bg-white rounded-xl items-center justify-center border border-gray-100">
                                <Activity size={18} color="#64748b" />
                            </View>
                            <View>
                                <Text className="font-semibold text-slate-700">Evening Snack</Text>
                                <Text className="text-xs text-gray-400">180 kcal • 8:30 PM</Text>
                            </View>
                        </View>
                        <ChevronRight size={18} color="#cbd5e1" />
                    </TouchableOpacity>
                ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Polished Helper Components ---

function TabButton({ title, isActive, onPress }: any) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-1 h-12 m-1 rounded-xl items-center justify-center ${isActive ? 'bg-white shadow-sm' : 'bg-transparent'}`}
    >
      <Text className={`font-bold text-sm ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function MetricCard({ label, value, subValue, icon, color, barColor, percent }: any) {
  return (
    <View style={{ width: screenWidth * 0.43 }} className="bg-white p-4 rounded-[24px] border border-gray-100 mb-4 shadow-sm">
      <View className="flex-row justify-between items-start mb-3">
        <View className={`w-10 h-10 rounded-full ${color} items-center justify-center`}>
          {icon}
        </View>
        <Text className="text-slate-400 text-[10px] font-bold uppercase mt-1">{label}</Text>
      </View>
      
      <View className="mb-3">
        <Text className="text-xl font-bold text-slate-900">{value}</Text>
        <Text className="text-xs text-gray-400 font-medium">{subValue}</Text>
      </View>

      <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <View style={{ width: `${percent}%` }} className={`h-full ${barColor} rounded-full`} />
      </View>
    </View>
  );
}

function LegendDot({ color, label, value }: any) {
  return (
    <View className="items-center">
        <View className="flex-row items-center gap-2 mb-1">
            <View className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <Text className="text-xs text-gray-400 font-medium">{label}</Text>
        </View>
        <Text className="text-sm font-bold text-slate-700">{value}</Text>
    </View>
  );
}