import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { Flame, Activity, AlertTriangle, Target, Check, X } from 'lucide-react-native';
import { useAuth } from '@/src/context/AuthContext';
import { useFocusEffect } from '@react-navigation/native'; // Useful to refresh when tab opens
import { api } from '@/src/services/api';
// --- Sub-component (Keep as is) ---
function CheckItem({ label, passed }) {
  return (
    <View style={[styles.checkItem, passed ? {backgroundColor: '#f0fdf4'} : {backgroundColor: '#fef2f2'}]}>
      <Text style={styles.checkLabel}>{label}</Text>
      {passed ? <Check size={16} color="#16a34a" /> : <X size={16} color="#dc2626" />}
    </View>
  );
}

// --- Main Component ---
export default function TodayTab() {
  const { userData } = useAuth();
  const email = userData?.email;
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch data from backend
  const fetchDailySummary = async () => {
    if (!email) return;
    try {
      const response = await api.get(`/daily-summary?email=${email}`);
      setSummaryData(response.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch on mount and when email changes
  useEffect(() => {
    fetchDailySummary();
  }, [email]);

  // Optional: Refresh when screen comes into focus (e.g., after adding a meal)
  useFocusEffect(
    useCallback(() => {
      fetchDailySummary();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDailySummary();
  };

  if (loading) {
    return <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size="large" color="#f97316"/></View>;
  }

  // Destructure data for easier usage
  const data = summaryData?.data;
  const profile = summaryData?.profile;
  const adherence = summaryData?.adherence;

  if (!data || !profile) return <Text>No data available</Text>;

  return (
    <ScrollView 
      contentContainerStyle={{paddingBottom: 20}}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.gridContainer}>
        {/* Calories Card */}
        <View style={[styles.card, styles.halfCard, { backgroundColor: '#fff7ed', borderColor: '#ffedd5' }]}>
          <View style={styles.cardHeader}>
            <Flame size={20} color="#f97316" fill="#f97316" />
            <Text style={styles.cardValue}>{Math.round(data.calories || 0)}</Text>
          </View>
          <Text style={styles.cardLabel}>Calories</Text>
          <Text style={styles.cardSub}>Target: {profile.calorie_target_low}-{profile.calorie_target_high}</Text>
        </View>

        {/* Protein Card */}
        <View style={[styles.card, styles.halfCard, { backgroundColor: '#fef2f2', borderColor: '#fee2e2' }]}>
          <View style={styles.cardHeader}>
            <Activity size={20} color="#ef4444" />
            <Text style={styles.cardValue}>{Math.round(data.protein || 0)}g</Text>
          </View>
          <Text style={styles.cardLabel}>Protein</Text>
          <Text style={styles.cardSub}>Target: {profile.protein_target}g</Text>
        </View>

        {/* Fiber Card */}
        <View style={[styles.card, styles.halfCard, { backgroundColor: '#fffbeb', borderColor: '#fef3c7' }]}>
          <View style={styles.cardHeader}>
            <Activity size={20} color="#d97706" />
            <Text style={styles.cardValue}>{Math.round(data.fiber || 0)}g</Text>
          </View>
          <Text style={styles.cardLabel}>Fiber</Text>
          <Text style={styles.cardSub}>Target: {profile.fiber_target_low}g</Text>
        </View>

        {/* Sodium Card */}
        <View style={[styles.card, styles.halfCard, { backgroundColor: '#eff6ff', borderColor: '#dbeafe' }]}>
          <View style={styles.cardHeader}>
            <AlertTriangle size={20} color="#3b82f6" />
            <Text style={styles.cardValue}>{Math.round(data.sodium || 0)}</Text>
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
              {adherence?.score || 0}%
            </Text>
          </View>
          
          <View style={styles.checklist}>
            <CheckItem label="Calories" passed={adherence?.caloriesOk} />
            <CheckItem label="Protein" passed={adherence?.proteinOk} />
            <CheckItem label="Fiber" passed={adherence?.fiberOk} />
            <CheckItem label="Sodium" passed={adherence?.sodiumOk} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 24, gap: 12, marginTop: 20 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 12 },
  halfCard: { width: '48%' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardValue: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  cardLabel: { fontSize: 12, fontWeight: '600', color: '#475569' },
  cardSub: { fontSize: 10, color: '#94a3b8', marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginLeft: 8 },
  scoreText: { fontSize: 24, fontWeight: 'bold', color: '#4f46e5' },
  checklist: { marginTop: 16, gap: 8 },
  checkItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderRadius: 12 },
  checkLabel: { fontSize: 12, fontWeight: '500', color: '#334155' },
});