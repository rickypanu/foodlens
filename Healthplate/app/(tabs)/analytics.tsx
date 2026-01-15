import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { LineChart, BarChart } from "react-native-gifted-charts";
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Calendar as CalendarIcon, 
  ChevronDown, 
  ArrowUp, 
  ArrowDown, 
  Flame, 
  Check, 
  X, 
  AlertTriangle, 
  Activity, 
  Scale, 
  Target,
  Plus
} from 'lucide-react-native';
import { subDays, differenceInDays, parseISO, format } from 'date-fns';

const screenWidth = Dimensions.get('window').width;

/* -------------------------------------------------------------------------- */
/* MOCK DATA GENERATORS (Replace these with your DB calls later)              */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

export default function AnalyticsHistory() {
  const [activeTab, setActiveTab] = useState('today'); // 'today', 'trends', 'insights'
  const [range, setRange] = useState('30d');
  const [modalVisible, setModalVisible] = useState(false);
  const [newWeight, setNewWeight] = useState('');

  // Local State for Data
  const [profile, setProfile] = useState(null);
  const [dailyNutrition, setDailyNutrition] = useState([]);
  const [weightLogs, setWeightLogs] = useState([]);

  // Simulate Fetching Data
  useEffect(() => {
    // In a real app, fetch from database here
    setProfile(MOCK_PROFILE);
    setDailyNutrition(generateMockMeals());
    setWeightLogs(generateMockWeights());
  }, []);

  // --- Logic Engine ---

  // 1. Goal Adherence Calculation
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

  // 2. Predictions (Linear Regression)
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

  // --- Render ---

  if (!profile) return null; // or Loading spinner

  const todayData = dailyNutrition[dailyNutrition.length - 1] || {};

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <SafeAreaView style={{ flex: 1 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Progress</Text>
            <Text style={styles.headerSubtitle}>Track your health journey</Text>
          </View>
          <TouchableOpacity style={styles.rangeButton}>
            <CalendarIcon size={14} color="#64748b" />
            <Text style={styles.rangeText}>{range}</Text>
            <ChevronDown size={14} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Custom Tabs */}
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
          
          {/* ---------------- TODAY TAB ---------------- */}
          {activeTab === 'today' && (
            <View style={styles.gridContainer}>
              {/* Calories Card */}
              <View style={[styles.card, styles.halfCard, { backgroundColor: '#fff7ed', borderColor: '#ffedd5' }]}>
                <View style={styles.cardHeader}>
                  <Flame size={20} color="#f97316" fill="#f97316" />
                  <Text style={styles.cardValue}>{Math.round(todayData.calories || 0)}</Text>
                </View>
                <Text style={styles.cardLabel}>Calories</Text>
                <Text style={styles.cardSub}>Target: {profile.calorie_target_low}-{profile.calorie_target_high}</Text>
              </View>

              {/* Protein Card */}
              <View style={[styles.card, styles.halfCard, { backgroundColor: '#fef2f2', borderColor: '#fee2e2' }]}>
                <View style={styles.cardHeader}>
                  <Activity size={20} color="#ef4444" />
                  <Text style={styles.cardValue}>{Math.round(todayData.protein || 0)}g</Text>
                </View>
                <Text style={styles.cardLabel}>Protein</Text>
                <Text style={styles.cardSub}>Target: {profile.protein_target}g</Text>
              </View>

              {/* Fiber Card */}
              <View style={[styles.card, styles.halfCard, { backgroundColor: '#fffbeb', borderColor: '#fef3c7' }]}>
                <View style={styles.cardHeader}>
                  <Activity size={20} color="#d97706" />
                  <Text style={styles.cardValue}>{Math.round(todayData.fiber || 0)}g</Text>
                </View>
                <Text style={styles.cardLabel}>Fiber</Text>
                <Text style={styles.cardSub}>Target: {profile.fiber_target_low}g</Text>
              </View>

              {/* Sodium Card */}
              <View style={[styles.card, styles.halfCard, { backgroundColor: '#eff6ff', borderColor: '#dbeafe' }]}>
                <View style={styles.cardHeader}>
                  <AlertTriangle size={20} color="#3b82f6" />
                  <Text style={styles.cardValue}>{Math.round(todayData.sodium || 0)}</Text>
                </View>
                <Text style={styles.cardLabel}>Sodium</Text>
                <Text style={styles.cardSub}>Cap: {profile.sodium_cap}mg</Text>
              </View>

              {/* Adherence Score */}
              <View style={[styles.card, { width: '100%' }]}>
                <View style={styles.rowBetween}>
                  <View style={styles.row}>
                    <Target size={20} color="#4f46e5" />
                    <Text style={styles.sectionTitle}>Daily Goal Adherence</Text>
                  </View>
                  <Text style={styles.scoreText}>
                    {goalAdherence[goalAdherence.length-1]?.score || 0}%
                  </Text>
                </View>
                
                <View style={styles.checklist}>
                  <CheckItem label="Calories" passed={goalAdherence[goalAdherence.length-1]?.caloriesOk} />
                  <CheckItem label="Protein" passed={goalAdherence[goalAdherence.length-1]?.proteinOk} />
                  <CheckItem label="Fiber" passed={goalAdherence[goalAdherence.length-1]?.fiberOk} />
                  <CheckItem label="Sodium" passed={goalAdherence[goalAdherence.length-1]?.sodiumOk} />
                </View>
              </View>
            </View>
          )}

          {/* ---------------- TRENDS TAB ---------------- */}
          {activeTab === 'trends' && (
            <View style={styles.sectionContainer}>
              <View style={styles.card}>
                <Text style={styles.chartTitle}>Calorie History</Text>
                <LineChart
                  data={dailyNutrition.map(d => ({ value: d.calories, label: d.date.slice(5) }))}
                  color="#f97316"
                  thickness={3}
                  startFillColor="rgba(249, 115, 22, 0.2)"
                  endFillColor="rgba(249, 115, 22, 0.01)"
                  startOpacity={0.9}
                  endOpacity={0.1}
                  areaChart
                  curved
                  hideRules
                  hideYAxisText
                  height={180}
                  width={screenWidth - 80}
                  spacing={40}
                  initialSpacing={10}
                />
              </View>

              <View style={styles.card}>
                <Text style={styles.chartTitle}>Macro Distribution (Avg)</Text>
                <BarChart
                  data={dailyNutrition.map(d => ({ 
                    value: d.protein, 
                    label: d.date.slice(8),
                    frontColor: '#ef4444' 
                  }))}
                  barWidth={12}
                  spacing={20}
                  roundedTop
                  hideRules
                  xAxisThickness={0}
                  yAxisThickness={0}
                  hideYAxisText
                  height={150}
                  width={screenWidth - 80}
                  labelTextStyle={{fontSize: 10, color: '#94a3b8'}}
                />
                <Text style={{textAlign: 'center', fontSize: 10, color: '#94a3b8', marginTop: 10}}>Daily Protein Intake (g)</Text>
              </View>
            </View>
          )}

          {/* ---------------- INSIGHTS TAB ---------------- */}
          {activeTab === 'insights' && (
            <View style={styles.sectionContainer}>
              
              {/* Calorie Prediction */}
              {predictions && (
                <View style={styles.card}>
                  <View style={styles.row}>
                    <Activity size={20} color="#8b5cf6" />
                    <Text style={styles.sectionTitle}>7-Day Forecast</Text>
                  </View>
                  
                  <View style={styles.predictionBox}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.textGray}>Current 7-day avg</Text>
                      <Text style={styles.textBold}>{Math.round(predictions.avgLast7)} kcal</Text>
                    </View>
                    <View style={[styles.rowBetween, {marginTop: 8}]}>
                      <Text style={styles.textGray}>Trend</Text>
                      <View style={styles.row}>
                        {predictions.trend > 0 ? <ArrowUp size={16} color="#f97316"/> : <ArrowDown size={16} color="#10b981"/>}
                        <Text style={{fontWeight: 'bold', marginLeft: 4}}>
                          {predictions.trend > 0 ? '+' : ''}{Math.round(predictions.trend)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.insightNote}>
                    <Text style={styles.insightText}>
                      Based on your current pace, your next week's average will be approx 
                      <Text style={{fontWeight: 'bold'}}> {Math.round(predictions.next7)} kcal/day</Text>.
                    </Text>
                  </View>
                </View>
              )}

              {/* Weight Trajectory */}
              <View style={styles.card}>
                <View style={styles.rowBetween}>
                  <View style={styles.row}>
                    <Scale size={20} color="#ec4899" />
                    <Text style={styles.sectionTitle}>Weight Trajectory</Text>
                  </View>
                  <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
                    <Plus size={16} color="white" />
                  </TouchableOpacity>
                </View>

                {weightTrend ? (
                  <View style={{marginTop: 16}}>
                     <View style={styles.rowBetween}>
                        <View>
                          <Text style={styles.textGray}>Current</Text>
                          <Text style={styles.bigNumber}>{weightTrend.current}kg</Text>
                        </View>
                        <View>
                           <Text style={styles.textGray}>Forecast (7d)</Text>
                           <Text style={[styles.bigNumber, {color: '#8b5cf6'}]}>
                             {weightTrend.predicted7.toFixed(1)}kg
                           </Text>
                        </View>
                     </View>
                     <Text style={[styles.textSmall, {marginTop: 12}]}>
                       Trending {weightTrend.dailyChange > 0 ? 'up' : 'down'} by {Math.abs(weightTrend.dailyChange).toFixed(2)} kg/day
                     </Text>
                  </View>
                ) : (
                  <Text style={{padding: 20, textAlign: 'center', color: '#94a3b8'}}>Not enough weight data.</Text>
                )}
              </View>

            </View>
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
                   // Mock Save
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

/* -------------------------------------------------------------------------- */
/* SUB COMPONENTS                                */
/* -------------------------------------------------------------------------- */

function CheckItem({ label, passed }) {
  return (
    <View style={[styles.checkItem, passed ? {backgroundColor: '#f0fdf4'} : {backgroundColor: '#fef2f2'}]}>
      <Text style={styles.checkLabel}>{label}</Text>
      {passed ? <Check size={16} color="#16a34a" /> : <X size={16} color="#dc2626" />}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* STYLES                                    */
/* -------------------------------------------------------------------------- */

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

  // Grid & Cards
  scrollContent: { paddingBottom: 40 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 24, gap: 12 },
  sectionContainer: { paddingHorizontal: 24, gap: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 12,
  },
  halfCard: { width: '48%' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardValue: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  cardLabel: { fontSize: 12, fontWeight: '600', color: '#475569' },
  cardSub: { fontSize: 10, color: '#94a3b8', marginTop: 4 },

  // List & Typography
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginLeft: 8 },
  scoreText: { fontSize: 24, fontWeight: 'bold', color: '#4f46e5' },
  checklist: { marginTop: 16, gap: 8 },
  checkItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderRadius: 12 },
  checkLabel: { fontSize: 12, fontWeight: '500', color: '#334155' },
  
  // Charts
  chartTitle: { fontSize: 14, fontWeight: '600', color: '#64748b', marginBottom: 20 },
  
  // Insights
  predictionBox: { backgroundColor: '#f3f4f6', padding: 12, borderRadius: 12, marginTop: 12 },
  insightNote: { backgroundColor: '#faf5ff', padding: 12, borderRadius: 12, marginTop: 12, borderWidth: 1, borderColor: '#e9d5ff' },
  insightText: { fontSize: 12, color: '#6b21a8' },
  textGray: { fontSize: 12, color: '#64748b' },
  textBold: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  bigNumber: { fontSize: 24, fontWeight: '900', color: '#1e293b' },
  textSmall: { fontSize: 12, color: '#64748b' },
  addButton: { backgroundColor: '#8b5cf6', borderRadius: 20, width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },

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