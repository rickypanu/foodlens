import React, { useState, useMemo, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react-native";
import { subDays, differenceInDays, parseISO, format } from "date-fns";
import CustomHeader from "@/src/components/header";
import { useAuth } from "@/src/context/AuthContext";
import { api } from "@/src/services/api";

// COMPONENTS
import TodayTab from "@/src/components/analytics/TodayTab";
import TrendsTab from "@/src/components/analytics/TrendsTab";
import InsightsTab from "@/src/components/analytics/InsightsTab";

/* ---------------- Mock Data Functions (Keep existing) ---------------- */
const generateMockMeals = () =>
  Array.from({ length: 14 }).map((_, i) => ({
    date: format(subDays(new Date(), i), "yyyy-MM-dd"),
    calories: 2000 + Math.random() * 500,
    protein: 120 + Math.random() * 40,
    carbs: 200 + Math.random() * 50,
    fat: 60 + Math.random() * 20,
    fiber: 20 + Math.random() * 15,
    sodium: 2000 + Math.random() * 500,
  })).reverse();

const generateMockWeights = () =>
  Array.from({ length: 5 }).map((_, i) => ({
    date: format(subDays(new Date(), i * 3), "yyyy-MM-dd"),
    weight_kg: 75 - i * 0.2,
  })).reverse();

const MOCK_PROFILE = {
  calorie_target_low: 1800,
  calorie_target_high: 2200,
  protein_target: 150,
  fiber_target_low: 30,
  sodium_cap: 2300,
};


export default function AnalyticsHistory() {
  const [activeTab, setActiveTab] = useState("today");
  const [range, setRange] = useState("total ");

  // Local State
  const [profile, setProfile] = useState(null);
  const [dailyNutrition, setDailyNutrition] = useState([]);
  const [weightLogs, setWeightLogs] = useState([]); 

  // Auth & Weight API State
  const { userData } = useAuth();
  const [weightHistory, setWeightHistory] = useState([]);

  // 1. Fetch Mock Data on Mount
  useEffect(() => {
    setProfile(MOCK_PROFILE);
    setDailyNutrition(generateMockMeals());
    setWeightLogs(generateMockWeights());
  }, []);

  // 2. Fetch Real Weight History from Backend
  const fetchWeightHistory = async () => {
    try {
      // Ensure we have a user email/ID before calling
      if (!userData?.email) return;
      
      console.log("Background Fetching history for:", userData.email); 
      const response = await api.get(`/users/weight_history/${userData.email}`);
      
      // Update state only if we got valid history
      if (response.data && response.data.history) {
          setWeightHistory(response.data.history);
      }
    } catch (error) {
      console.error("Failed to load history", error);
    }
  };

  // --- NEW LOGIC START ---
  // This effect runs whenever you switch tabs. 
  // If you switch to 'insights', it triggers a fetch.
  // Since we don't clear 'weightHistory' before fetching, the old data remains visible.
  useEffect(() => {
    if (activeTab === 'insights' && userData?.email) {
        fetchWeightHistory();
    }
  }, [activeTab, userData]);
  // --- NEW LOGIC END ---

  // Initial load (Optional: keeps data ready if they switch quickly)
  useEffect(() => {
    if (userData?.email) {
      fetchWeightHistory();
    }
  }, [userData]);

  // --- Calculations ---
  // 1. Goal Adherence
  const goalAdherence = useMemo(() => {
    return dailyNutrition.map((day) => {
      if (!profile) return { date: day.date, score: 0 };
      const caloriesOk = day.calories >= profile.calorie_target_low && day.calories <= profile.calorie_target_high * 1.1;
      const proteinOk = day.protein >= profile.protein_target * 0.9;
      const fiberOk = day.fiber >= profile.fiber_target_low;
      const sodiumOk = day.sodium <= profile.sodium_cap;
      const score = ([caloriesOk, proteinOk, fiberOk, sodiumOk].filter(Boolean).length / 4) * 100;
      return {
        date: day.date,
        score: Math.round(score),
        caloriesOk, proteinOk, fiberOk, sodiumOk,
      };
    });
  }, [dailyNutrition, profile]);

  // 2. Weight Trend Calculation
  const activeWeightData = weightHistory.length > 0 ? weightHistory : weightLogs;
  
  const weightTrend = useMemo(() => {
    // Need at least 1 entry to calculate average, 2 for trend
    if (!activeWeightData || activeWeightData.length === 0) return null;
    
    // Sort by date to be safe
    const sorted = [...activeWeightData].sort((a,b) => new Date(a.date) - new Date(b.date));
    
    // --- FIX: Calculate 7-Day Average ---
    const last7Entries = sorted.slice(-7);
    const sumWeights = last7Entries.reduce((acc, item) => acc + (item.weight || item.weight_kg), 0);
    const avgLast7 = sumWeights / last7Entries.length;
    // -------------------------------------

    // Trend Calculations (Requires at least 2 points)
    if (sorted.length < 2) {
        return { avgLast7, current: sorted[0].weight || sorted[0].weight_kg };
    }

    const recent = sorted.slice(-5); // Use last 5 for trend trajectory
    const firstDate = parseISO(recent[0].date);
    const lastDate = parseISO(recent[recent.length - 1].date);
    const days = differenceInDays(lastDate, firstDate);
    
    const startWeight = recent[0].weight || recent[0].weight_kg;
    const endWeight = recent[recent.length - 1].weight || recent[recent.length - 1].weight_kg;
    
    const totalChange = endWeight - startWeight;
    const dailyChange = totalChange / (days || 1);
    
    return {
      current: endWeight,
      dailyChange,
      avgLast7, // <--- We are now passing this correctly!
      predicted7: endWeight + dailyChange * 7,
    };
  }, [activeWeightData]);

  if (!profile) return null;

  const todayData = dailyNutrition[dailyNutrition.length - 1] || {};
  const currentAdherence = goalAdherence[goalAdherence.length - 1] || {};

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Progress Dashboard</Text>
            <Text style={styles.headerSubtitle}>Track your health journey with detailed analytics</Text>
          </View>
          {/* <TouchableOpacity style={styles.rangeButton}>
            <CalendarIcon size={14} color="#64748b" />
            <Text style={styles.rangeText}>{range}</Text>
            <ChevronDown size={14} color="#64748b" />
          </TouchableOpacity> */}
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          {["today", "trends", "insights"].map((tab) => (
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
          {activeTab === "today" && (
            <TodayTab data={todayData} profile={profile} adherence={currentAdherence} />
          )}

          {activeTab === "trends" && <TrendsTab dailyData={dailyNutrition} />}

          {activeTab === "insights" && (
            <InsightsTab 
                weightHistory={weightHistory}      // Pass the API state
                refreshData={fetchWeightHistory}   // Pass the fetch function
                predictions={weightTrend}          // Pass calculated trends
             />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: 16, marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#1e293b" },
  headerSubtitle: { fontSize: 12, color: "#64748b" },
  rangeButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: "#e2e8f0" },
  rangeText: { marginHorizontal: 6, fontSize: 12, fontWeight: "600", color: "#475569" },
  tabContainer: { flexDirection: "row", marginHorizontal: 24, backgroundColor: "#e2e8f0", borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 10 },
  activeTab: { backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  tabText: { fontSize: 12, fontWeight: "600", color: "#64748b" },
  activeTabText: { color: "#0f172a" },
  scrollContent: { paddingBottom: 40 },
});