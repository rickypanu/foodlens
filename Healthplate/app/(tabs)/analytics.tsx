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
  const [range, setRange] = useState("30d");

  // Local State
  const [profile, setProfile] = useState(null);
  const [dailyNutrition, setDailyNutrition] = useState([]);
  const [weightLogs, setWeightLogs] = useState([]);

  // Auth & Weight API State
  const { userdata } = useAuth();
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
      // Ensure we have a user ID before calling
      if (!userdata?._id) return;
      const response = await api.get(`/users/weight_history/${userdata._id}`);
      setWeightHistory(response.data.history);
    } catch (error) {
      console.error("Failed to load history", error);
    }
  };

  useEffect(() => {
    if (userdata?._id) {
      fetchWeightHistory();
    }
  }, [userdata]);

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
    if (weightLogs.length < 2) return null;
    const recent = weightLogs.slice(-5);
    const days = differenceInDays(parseISO(recent[recent.length - 1].date), parseISO(recent[0].date));
    const totalChange = recent[recent.length - 1].weight_kg - recent[0].weight_kg;
    const dailyChange = totalChange / (days || 1);
    return {
      current: recent[recent.length - 1].weight_kg,
      dailyChange,
      predicted7: recent[recent.length - 1].weight_kg + dailyChange * 7,
    };
  }, [weightLogs]);

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
          <TouchableOpacity style={styles.rangeButton}>
            <CalendarIcon size={14} color="#64748b" />
            <Text style={styles.rangeText}>{range}</Text>
            <ChevronDown size={14} color="#64748b" />
          </TouchableOpacity>
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
              predictions={predictions}
              weightTrend={weightTrend}
              weightHistory={weightHistory} // Passed from backend call
              refreshData={fetchWeightHistory} // Passed refresh function
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