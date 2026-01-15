import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react-native';
import { subDays, differenceInDays, parseISO, format } from 'date-fns';
import CustomHeader from '@/src/components/header';

// IMPORT YOUR NEW COMPONENTS
import TodayTab from '@/src/components/analytics/TodayTab';
import TrendsTab from '@/src/components/analytics/TrendsTab';
import InsightsTab from '@/src/components/analytics/InsightsTab';

/* ---------------- Mock Data Functions ---------------- */
const generateMockMeals = () => Array.from({ length: 14 }).map((_, i) => ({
  date: format(subDays(new Date(), i), 'yyyy-MM-dd'),
  calories: 2000 + Math.random() * 500,
  protein: 120 + Math.random() * 40,
  carbs: 200 + Math.random() * 50,
  fat: 60 + Math.random() * 20,
  fiber: 20 + Math.random() * 15,
  sodium: 2000 + Math.random() * 500,
})).reverse();

const generateMockWeights = () => Array.from({ length: 5 }).map((_, i) => ({
  date: format(subDays(new Date(), i * 3), 'yyyy-MM-dd'),
  weight_kg: 75 - (i * 0.2)
})).reverse();

const MOCK_PROFILE = {
  calorie_target_low: 1800,
  calorie_target_high: 2200,
  protein_target: 150,
  fiber_target_low: 30,
  sodium_cap: 2300,
};

/* ---------------- Main Component ---------------- */

export default function AnalyticsHistory() {
  const [activeTab, setActiveTab] = useState('today');
  const [range, setRange] = useState('30d');
  const [modalVisible, setModalVisible] = useState(false);
  const [newWeight, setNewWeight] = useState('');

  // Local State for Data
  const [profile, setProfile] = useState(null);
  const [dailyNutrition, setDailyNutrition] = useState([]);
  const [weightLogs, setWeightLogs] = useState([]);

  // Simulate Fetching Data
  useEffect(() => {
    setProfile(MOCK_PROFILE);
    setDailyNutrition(generateMockMeals());
    setWeightLogs(generateMockWeights());
  }, []);

  // --- Logic Engine (Calculations) ---

  // 1. Goal Adherence
  const goalAdherence = useMemo(() => {
    return dailyNutrition.map(day => {
      if (!profile) return { date: day.date, score: 0 };
      const caloriesOk = day.calories >= profile.calorie_target_low && day.calories <= profile.calorie_target_high * 1.1;
      const proteinOk = day.protein >= profile.protein_target * 0.9;
      const fiberOk = day.fiber >= profile.fiber_target_low;
      const sodiumOk = day.sodium <= profile.sodium_cap;
      const score = [caloriesOk, proteinOk, fiberOk, sodiumOk].filter(Boolean).length / 4 * 100;
      return { date: day.date, score: Math.round(score), caloriesOk, proteinOk, fiberOk, sodiumOk };
    });
  }, [dailyNutrition, profile]);

  // 2. Predictions
  const predictions = useMemo(() => {
    if (dailyNutrition.length < 7) return null;
    const recent7 = dailyNutrition.slice(-7);
    const avgLast7 = recent7.reduce((a, b) => a + b.calories, 0) / 7;
    const prev7 = dailyNutrition.slice(-14, -7);
    const avgPrev7 = prev7.length ? prev7.reduce((a, b) => a + b.calories, 0) / prev7.length : avgLast7;
    const trend = avgLast7 - avgPrev7;
    return { avgLast7, avgPrev7, trend, next7: avgLast7 + trend };
  }, [dailyNutrition]);

  // 3. Weight Trend
  const weightTrend = useMemo(() => {
    if(weightLogs.length < 2) return null;
    const recent = weightLogs.slice(-5);
    const days = differenceInDays(parseISO(recent[recent.length-1].date), parseISO(recent[0].date));
    const totalChange = recent[recent.length-1].weight_kg - recent[0].weight_kg;
    const dailyChange = totalChange / (days || 1);
    return { current: recent[recent.length-1].weight_kg, dailyChange, predicted7: recent[recent.length-1].weight_kg + (dailyChange * 7) };
  }, [weightLogs]);

  if (!profile) return null;

  // Prepare data for Today Tab
  const todayData = dailyNutrition[dailyNutrition.length - 1] || {};
  const currentAdherence = goalAdherence[goalAdherence.length - 1] || {};

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader/>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Progress Dashboard</Text>
            <Text style={styles.headerSubtitle}>Track your health journey with detailed analytics</Text>
          </View>
          <TouchableOpacity style={styles.rangeButton}>
            <CalendarIcon size={14} color="#64748b" />
            <Text style={styles.rangeText}>{range}</Text>
            <ChevronDown size={14} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          {['today', 'trends', 'insights'].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {activeTab === 'today' && (
            <TodayTab 
              data={todayData} 
              profile={profile} 
              adherence={currentAdherence} 
            />
          )}

          {activeTab === 'trends' && (
            <TrendsTab 
              dailyData={dailyNutrition} 
            />
          )}

          {activeTab === 'insights' && (
            <InsightsTab 
              predictions={predictions} 
              weightTrend={weightTrend} 
              onAddWeight={() => setModalVisible(true)}
            />
          )}

        </ScrollView>
        
        {/* Weight Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Log Weight</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Weight in kg" 
                keyboardType="numeric"
                value={newWeight}
                onChangeText={setNewWeight}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.btn, styles.btnCancel]}>
                   <Text style={{color: '#64748b'}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                   Alert.alert("Saved", "Weight logged successfully (Mock)");
                   setModalVisible(false);
                   setNewWeight('');
                }} style={[styles.btn, styles.btnSave]}>
                   <Text style={{color: 'white', fontWeight: 'bold'}}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  headerSubtitle: { fontSize: 12, color: '#64748b' },
  rangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  rangeText: { marginHorizontal: 6, fontSize: 12, fontWeight: '600', color: '#475569' },
  
  // Tabs
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  tabText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  activeTabText: { color: '#0f172a' },
  
  scrollContent: { paddingBottom: 40 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', width: '80%', padding: 24, borderRadius: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { backgroundColor: '#f1f5f9', padding: 12, borderRadius: 12, fontSize: 16, marginBottom: 24 },
  modalButtons: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, padding: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnCancel: { backgroundColor: '#f1f5f9' },
  btnSave: { backgroundColor: '#8b5cf6' },
});