import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { api } from "@/src/services/api";
import TodayMeal from "../homecomponent/todaymeal";
import StreakCalendar from "../homecomponent/streak";
import { useMotivation } from "@/src/hooks/useMotivation";

export default function HomeScreen() {
  const { userData } = useAuth();
  const router = useRouter();

  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [weekData, setWeekData] = useState([]);

  // Store the full summary (targets + totals) from /daily-summary
  const [summary, setSummary] = useState(null);

  // Store just the list of meals
  const [meals, setMeals] = useState([]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // --- FETCH DATA ---
  const fetchDashboardData = async () => {
    try {
      const userEmail = userData?.email;
      if (!userEmail) {
        setLoading(false);
        return;
      }

      const dateStr = new Date().toISOString().split("T")[0];

      //
      // We fetch 3 things in parallel:
      // 1. Summary: For dynamic Targets (Profile) and Totals (Calories/Protein)
      // 2. Stats/Meals: To get the actual list of food items for the list view
      // 3. WeekData: For the streak calendar
      const [summaryRes, statsRes, weekRes] = await Promise.all([
        api.get(`/daily-summary?email=${userEmail}`), // New Endpoint (Totals + Targets)
        api.get(`/users/${userEmail}/daily-stats?date_str=${dateStr}`), // To get Meal List
        api.get(`/users/${userEmail}/weekly-activity`), // Streak Data
      ]);

      setSummary(summaryRes.data); // Contains { data: {...}, profile: {...} }
      setMeals(statsRes.data.meals || []); // Extract meals list
      setWeekData(weekRes.data);
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  // --- DELETE FUNCTION ---
  const handleDeleteMeal = async (mealId) => {
    try {
      const userEmail = userData?.email;
      if (!mealId || !userEmail) return;

      await api.delete(`/users/${userEmail}/meals/${mealId}`);

      // Refresh data to update totals and remove item from list
      await fetchDashboardData();
      Alert.alert("Success", "Meal deleted successfully");
    } catch (error) {
      console.log("Delete error:", error);
      Alert.alert("Error", "Could not delete meal.");
    }
  };

  // --- DYNAMIC CALCULATIONS ---
  // Default values to prevent crash if data is loading
  const currentCalories = summary?.data?.calories || 0;
  const currentProtein = summary?.data?.protein || 0;
  const currentFat = summary?.data?.fat || 0;
  // Recover the 'Daily Goal' from the low/high range or use a safe default
  // Based on your backend logic: low = goal - 200. So Goal = low + 200.
  const calorieTarget = summary?.profile?.calorie_target_low
    ? summary.profile.calorie_target_low + 200
    : 2000;

  const proteinTarget = summary?.profile?.protein_target || 100;
  const fatTarget = summary?.profile?.fat_target || 70;

  const remainingCalories = Math.round(calorieTarget - currentCalories);
  const mealsCount = meals.length;

  // Streak count is the number of days in a row that the user has been on track
  // based on the current week's data.
  const streakCount = weekData?.current_streak || 0;

  const motivation = useMotivation(
    {
      total_calories: currentCalories,
      total_protein: currentProtein,
      meal_count: mealsCount,
    },
    {
      calories: calorieTarget,
      protein: proteinTarget,
    },
    streakCount
  );

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Healthplate</Text>
        <Text style={styles.tagline}>
          Made for Indian Meals. Built for better Health
        </Text>
      </View>

      <Text style={styles.greeting}>Hey {userData?.name || "User"}! 👋</Text>
      <Text style={styles.date}>{today}</Text>

      <View style={styles.motivationCard}>
        <Ionicons name="sparkles" size={18} color="#FFD700" />
        <Text style={styles.motivationText}>{motivation}</Text>
      </View>

      {!loading && <StreakCalendar weekData={weekData} />}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4CAF50"
          style={{ marginTop: 20 }}
        />
      ) : (
        <>
          <View style={styles.statsRow}>
            {/* Calories Card */}
            <View style={styles.darkCard}>
              <Text style={styles.cardLabel}>Remaining</Text>
              {/* Show different color if over budget */}
              <Text
                style={[
                  styles.cardValue,
                  remainingCalories < 0 && { color: "#FF5252" },
                ]}
              >
                {remainingCalories}
              </Text>
              <Text style={styles.cardSub}>
                {remainingCalories < 0 ? "calories over" : "calories left"}
              </Text>
              <Text style={{ color: "#6B7280", fontSize: 10, marginTop: 5 }}>
                Goal: {Math.round(calorieTarget)}
              </Text>
            </View>

            {/* Meals Count Card */}
            <View style={styles.lightCard}>
              <Text style={styles.cardLabel}>Meals</Text>
              <Text style={styles.cardValueDark}>{mealsCount}</Text>
              <Text style={styles.cardSub}>logged today</Text>
            </View>
          </View>

          {/* Protein Progress Card */}
          <View style={styles.proteinCard}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.cardLabel}>Protein</Text>
              <Text style={styles.cardValueDark}>
                {Math.round(currentProtein)}g / {Math.round(proteinTarget)}g
              </Text>
            </View>
            <View
              style={{
                height: 6,
                backgroundColor: "#E5E7EB",
                borderRadius: 3,
                marginTop: 10,
              }}
            >
              <View
                style={{
                  height: 6,
                  backgroundColor: "#4CAF50",
                  borderRadius: 3,
                  // Cap width at 100% so it doesn't overflow
                  width: `${Math.min(
                    (currentProtein / proteinTarget) * 100,
                    100
                  )}%`,
                }}
              />
            </View>
          </View>
          {/* fat card */}
          <View style={[styles.macroCard, { marginTop: 12 }]}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.cardLabel}>Fat</Text>
              <Text style={styles.cardValueDark}>
                {Math.round(currentFat)}g / {Math.round(fatTarget)}g
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={{
                  ...styles.progressBarFill,
                  backgroundColor: "#F59E0B", // Amber/Yellow for Fat
                  width: `${Math.min((currentFat / fatTarget) * 100, 100)}%`,
                }}
              />
            </View>
          </View>

          {/* Today's Meals List */}
          <TodayMeal meals={meals} onDelete={handleDeleteMeal} />
        </>
      )}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 0 },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  logo: { width: 60, height: 60, marginBottom: 8 },
  appName: { fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 4 },
  tagline: { fontSize: 14, color: "#666", textAlign: "center" },
  greeting: { fontSize: 28, fontWeight: "700" },
  date: { fontSize: 16, color: "#777", marginBottom: 20 },
  motivationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
  },
  motivationText: {
    marginLeft: 8,
    color: "#065F46",
    fontSize: 14,
    fontWeight: "500",
  },

  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  darkCard: {
    backgroundColor: "#111827",
    width: "48%",
    padding: 16,
    borderRadius: 20,
  },
  lightCard: {
    backgroundColor: "#F9FAFB",
    width: "48%",
    padding: 16,
    borderRadius: 20,
  },
  cardLabel: { color: "#9CA3AF", fontSize: 14 },
  cardValue: { color: "#fff", fontSize: 32, fontWeight: "700" },
  cardValueDark: { fontSize: 32, fontWeight: "700", color: "#111827" },
  cardSub: { color: "#9CA3AF", marginTop: 4 },
  proteinCard: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 20,
    marginTop: 16,
    marginBottom: 20,
  },
  macroCard: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 20,
    marginTop: 16,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    marginTop: 10,
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
  },
});
