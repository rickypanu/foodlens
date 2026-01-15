import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert, 
} from "react-native";
import { useAuth } from "../../src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { api } from "@/src/services/api";
import TodayMeal from "../homecomponent/todaymeal";
import StreakCalendar from "../homecomponent/streak"; 

const CALORIE_TARGET = 2500;
const PROTEIN_TARGET = 109;

export default function HomeScreen() {
  const { userData } = useAuth();
  const router = useRouter();
  
  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [weekData, setWeekData] = useState([]); 
  const [stats, setStats] = useState({
    total_calories: 0,
    total_protein: 0,
    meal_count: 0,
    meals: []
  });

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  // --- FETCH DATA ---
  const fetchDashboardData = async () => {
    try {
      const userEmail = userData?.email;
      if (!userEmail) {
        setLoading(false);
        return;
      }

      // Use today's date
      const dateStr = new Date().toISOString().split('T')[0];

      const [statsRes, weekRes] = await Promise.all([
        api.get(`/users/${userEmail}/daily-stats?date_str=${dateStr}`),
        api.get(`/users/${userEmail}/weekly-activity`) 
      ]);
      
      setStats(statsRes.data);
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
    console.log("3. Parent received delete request for ID:", mealId);
    
    try {
      // 1. Validate Data
      const userEmail = userData?.email;
      console.log("4. User Email:", userEmail);

      if (!mealId) {
        Alert.alert("Error", "Meal ID is missing.");
        return;
      }
      if (!userEmail) {
        Alert.alert("Error", "User email is missing.");
        return;
      }

      // 2. Call API
      // Ensure your backend URL is actually pointing to your computer/server IP, not localhost if on Android device
      const url = `/users/${userEmail}/meals/${mealId}`;
      console.log("5. Calling API:", url);

      const response = await api.delete(url);
      
      console.log("6. Delete Success:", response.data);
      
      // 3. Refresh List
      await fetchDashboardData(); 
      
      Alert.alert("Success", "Meal deleted successfully");

    } catch (error) {
      console.log("Delete error details:", error.response ? error.response.data : error.message);
      Alert.alert("Error", "Could not delete meal.");
    }
};

// ... return method stays the same
  const remainingCalories = CALORIE_TARGET - stats.total_calories;

  return (
    <ScrollView style={styles.container}>
      {/* BANNER */}
      <View style={styles.bannerContainer}>
        <View style={styles.leftContent}>
          <View style={styles.iconCircle}>
            <Text style={{ fontSize: 16 }}>🕒</Text>
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.bannerTitle}>Free trial ends in 4 days</Text>
            <Text style={styles.bannerSubtitle}>Continue for just ₹40/month</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.upgradeButton} onPress={() => router.push("/SubscriptionChoice")}>
          <Text style={styles.upgradeBtnText}>Upgrade</Text>
        </TouchableOpacity>
      </View>

      {/* HEADER */}
      <View style={styles.header}>
        <Image source={require("../../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
        <Text style={styles.appName}>Healthplate</Text>
        <Text style={styles.tagline}>Made for Indian Meals. Built for better Health</Text>
      </View>

      <Text style={styles.greeting}>Hey {userData?.name || "User"}! 👋</Text>
      <Text style={styles.date}>{today}</Text>

      {!loading && <StreakCalendar weekData={weekData} />}

      {/* ADD MEAL BUTTON */}
      <View style={styles.statusCard}>
        <TouchableOpacity style={styles.addMealButton} onPress={() => router.push("/addmeal")}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addMealText}>Add Meal</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={{marginTop: 20}} />
      ) : (
        <>
          <View style={styles.statsRow}>
            <View style={styles.darkCard}>
              <Text style={styles.cardLabel}>Remaining</Text>
              <Text style={styles.cardValue}>{remainingCalories}</Text>
              <Text style={styles.cardSub}>calories left</Text>
            </View>
            <View style={styles.lightCard}>
              <Text style={styles.cardLabel}>Meals</Text>
              <Text style={styles.cardValueDark}>{stats.meal_count}</Text>
              <Text style={styles.cardSub}>logged today</Text>
            </View>
          </View>

          <View style={styles.proteinCard}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
               <Text style={styles.cardLabel}>Protein</Text>
               <Text style={styles.cardValueDark}>{stats.total_protein}g / {PROTEIN_TARGET}g</Text>
            </View>
            <View style={{height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, marginTop: 10}}>
              <View style={{
                height: 6, backgroundColor: '#4CAF50', borderRadius: 3, 
                width: `${Math.min((stats.total_protein / PROTEIN_TARGET) * 100, 100)}%`
              }} />
            </View>
          </View>

           {/* --- CRITICAL PART: Pass the function here --- */}
           <TodayMeal meals={stats.meals} onDelete={handleDeleteMeal}/>
        </>
      )}
      <View style={{height: 20}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bannerContainer: { backgroundColor: "#FFF8E1", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop:30, paddingVertical: 12, paddingHorizontal: 16, width: "100%" },
  leftContent: { flexDirection: "row", alignItems: "center", flex: 1, marginRight: 12 },
  iconCircle: { backgroundColor: "#FFE0B2", width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", marginRight: 10 },
  textWrapper: { flex: 1 },
  bannerTitle: { color: "#78350F", fontWeight: "bold", fontSize: 14, marginBottom: 2 },
  bannerSubtitle: { color: "#92400E", fontSize: 12 },
  upgradeButton: { backgroundColor: "#F59E0B", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  upgradeBtnText: { color: "#FFFFFF", fontWeight: "600", fontSize: 14 },
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 0 },
  addMealButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#4CAF50", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25, marginTop: 12 },
  addMealText: { color: "#fff", fontWeight: "600", marginLeft: 8 },
  header: { alignItems: "center", justifyContent: "center", paddingVertical: 20 },
  logo: { width: 60, height: 60, marginBottom: 8 },
  appName: { fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 4 },
  tagline: { fontSize: 14, color: "#666", textAlign: "center" },
  greeting: { fontSize: 28, fontWeight: "700" },
  date: { fontSize: 16, color: "#777", marginBottom: 20 },
  statusCard: { backgroundColor: "#E8F5E9", padding: 15, borderRadius: 16, marginBottom: 20 },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  darkCard: { backgroundColor: "#111827", width: "48%", padding: 16, borderRadius: 20 },
  lightCard: { backgroundColor: "#F9FAFB", width: "48%", padding: 16, borderRadius: 20 },
  cardLabel: { color: "#9CA3AF", fontSize: 14 },
  cardValue: { color: "#fff", fontSize: 32, fontWeight: "700" },
  cardValueDark: { fontSize: 32, fontWeight: "700", color: '#111827' },
  cardSub: { color: "#9CA3AF", marginTop: 4 },
  proteinCard: { backgroundColor: "#F9FAFB", padding: 16, borderRadius: 20, marginTop: 16 },
});