import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../src/context/AuthContext"; // Assuming you have this
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { api } from "@/src/services/api";

// --- CONFIGURATION ---
const CALORIE_TARGET = 2500; // Set your daily goal here
const PROTEIN_TARGET = 109;  // Set your daily protein goal here

export default function HomeScreen() {
  const { userData } = useAuth();
  const navigation = useNavigation();
  const router = useRouter();
  
  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_calories: 0,
    total_protein: 0,
    meal_count: 0
  });

  // --- DATE FORMATTING ---
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // --- FETCH DATA FUNCTION ---
const fetchDailyStats = async () => {
    try {
      // 1. Check if email exists first
      const userEmail = userData?.email;
      if (!userEmail) {
        console.log("No user email found, skipping fetch.");
        setLoading(false);
        return;
      }

      // 2. Get Date
      const dateStr = new Date().toISOString().split('T')[0];

      // 3. Request with BACKTICKS (key change here)
      console.log(`Fetching stats for: ${userEmail}`); // Debug log
      const response = await api.get(`/users/${userEmail}/daily-stats?date_str=${dateStr}`);
      
      setStats(response.data);
    } catch (error) {
      console.log("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- REFRESH ON FOCUS ---
  // This runs every time you navigate back to this screen
  useFocusEffect(
    useCallback(() => {
      fetchDailyStats();
    }, [])
  );

  // Calculate Remaining
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
            <Text style={styles.bannerSubtitle}>
              Enjoying FoodLens? Continue for just ₹40/month
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={() => router.push("/SubscriptionChoice")}
        >
          <Text style={styles.upgradeBtnText}>Upgrade</Text>
        </TouchableOpacity>
      </View>

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

      {/* GREETING */}
      <Text style={styles.greeting}>Hey {userData?.name || "Unknown"}! 👋</Text>
      <Text style={styles.date}>{today}</Text>

      {/* HEALTH TIP */}
      <View style={styles.tipCard}>
        <Ionicons name="water" size={22} color="#4CAF50" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.tipTitle}>Health Tip for You</Text>
          <Text style={styles.tipText}>
            Hydration matters – aim for 8–10 glasses of water daily
          </Text>
        </View>
      </View>

      {/* STATUS CARD */}
      <View style={styles.statusCard}>
        <Ionicons name="heart" size={22} color="#4CAF50" />
        <Text style={styles.statusTitle}>No Major Risks</Text>
        <Text style={styles.statusText}>Keep up the good work!</Text>
      </View>

      {/* ADD MEAL BUTTON */}
      <View style={styles.statusCard}>
        <TouchableOpacity
          style={styles.addMealButton}
          onPress={() => router.push("/addmeal")}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addMealText}>Add Meal</Text>
        </TouchableOpacity>
      </View>

      {/* --- DYNAMIC STATS SECTION --- */}
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={{marginTop: 20}} />
      ) : (
        <>
          {/* CALORIES & MEALS ROW */}
          <View style={styles.statsRow}>
            {/* Dark Card - Remaining Calories */}
            <View style={styles.darkCard}>
              <Text style={styles.cardLabel}>Remaining</Text>
              <Text style={styles.cardValue}>{remainingCalories}</Text>
              <Text style={styles.cardSub}>calories left today</Text>
            </View>

            {/* Light Card - Meal Count */}
            <View style={styles.lightCard}>
              <Text style={styles.cardLabel}>Meals</Text>
              <Text style={styles.cardValueDark}>{stats.meal_count}</Text>
              <Text style={styles.cardSub}>logged today</Text>
            </View>
          </View>

          {/* PROTEIN CARD */}
          <View style={styles.proteinCard}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
               <Text style={styles.cardLabel}>Protein</Text>
               <Text style={styles.cardValueDark}>
                 {stats.total_protein}g 
                 <Text style={{fontSize: 14, color: '#9CA3AF', fontWeight: '400'}}> / {PROTEIN_TARGET}g</Text>
               </Text>
            </View>
            
            {/* Simple Progress Bar */}
            <View style={{height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, marginTop: 10}}>
              <View style={{
                height: 6, 
                backgroundColor: '#4CAF50', 
                borderRadius: 3, 
                width: `${Math.min((stats.total_protein / PROTEIN_TARGET) * 100, 100)}%`
              }} />
            </View>
          </View>
        </>
      )}
      
      {/* Spacer for bottom tab bar */}
      <View style={{height: 20}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: "#FFF8E1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  iconCircle: {
    backgroundColor: "#FFE0B2",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  textWrapper: {
    flex: 1,
  },
  bannerTitle: {
    color: "#78350F",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
  },
  bannerSubtitle: {
    color: "#92400E",
    fontSize: 12,
  },
  upgradeButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  upgradeBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 0,
  },
  addMealButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 12,
  },

  addMealText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },

  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },

  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },

  appName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },

  greeting: {
    fontSize: 28,
    fontWeight: "700",
  },

  date: {
    fontSize: 16,
    color: "#777",
    marginBottom: 20,
  },

  tipCard: {
    flexDirection: "row",
    backgroundColor: "#E8F5E9",
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
  },

  tipTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },

  tipText: {
    color: "#555",
  },

  statusCard: {
    backgroundColor: "#E8F5E9",
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,
  },

  statusTitle: {
    fontWeight: "600",
    marginTop: 6,
  },

  statusText: {
    color: "#555",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

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

  cardLabel: {
    color: "#9CA3AF",
    fontSize: 14,
  },

  cardValue: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
  },

  cardValueDark: {
    fontSize: 32,
    fontWeight: "700",
    color: '#111827'
  },

  cardSub: {
    color: "#9CA3AF",
    marginTop: 4,
  },

  proteinCard: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 20,
    marginTop: 16,
  },
});