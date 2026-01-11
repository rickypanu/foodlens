import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { userData } = useAuth();
  const navigation = useNavigation();
  const router = useRouter();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.bannerContainer}>
        <View style={styles.leftContent}>
          {/* Icon: You can replace '🕒' with an <Icon /> component if you use vector-icons */}
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

        {/* The Upgrade Button */}
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={() => router.push("/SubscriptionChoice")}
        >
          <Text style={styles.upgradeBtnText}>Upgrade</Text>
        </TouchableOpacity>
      </View>
      {/* HEADER */}
      <View style={styles.header}>
        {/* Logo */}
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* App Name */}
        <Text style={styles.appName}>Healthplate</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>
          Made for Indian Meals. Built for better Health
        </Text>
      </View>

      {/* GREETING */}
      <Text style={styles.greeting}>Hey {userData?.name || "User"}! 👋</Text>
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

      <View style={styles.statusCard}>
        {/* Add Meal Button */}
        <TouchableOpacity
          style={styles.addMealButton}
          onPress={() => router.push("/add")} // navigate to add tab
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addMealText}>Add Meal</Text>
        </TouchableOpacity>
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        <View style={styles.darkCard}>
          <Text style={styles.cardLabel}>Remaining</Text>
          <Text style={styles.cardValue}>3015</Text>
          <Text style={styles.cardSub}>calories left today</Text>
        </View>

        <View style={styles.lightCard}>
          <Text style={styles.cardLabel}>Meals</Text>
          <Text style={styles.cardValueDark}>0</Text>
          <Text style={styles.cardSub}>logged today</Text>
        </View>
      </View>

      {/* PROTEIN */}
      <View style={styles.proteinCard}>
        <Text style={styles.cardLabel}>Protein</Text>
        <Text style={styles.cardValueDark}>0g</Text>
        <Text style={styles.cardSub}>/ 109g target</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: "#FFF8E1", // The light yellow background
    flexDirection: "row", // Align items horizontally
    alignItems: "center", // Center items vertically
    justifyContent: "space-between", // Push button to the right
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Allows text to take up remaining space so it wraps if needed
    marginRight: 12,
  },
  iconCircle: {
    backgroundColor: "#FFE0B2", // Slightly darker yellow circle behind icon
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  textWrapper: {
    flex: 1, // Ensures text wraps correctly before hitting the button
  },
  bannerTitle: {
    color: "#78350F", // Dark brownish-orange for title
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
  },
  bannerSubtitle: {
    color: "#92400E", // Lighter brown for subtitle
    fontSize: 12,
  },
  upgradeButton: {
    backgroundColor: "#F59E0B", // The specific Orange button color
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
  subscriptionLink: {
    color: "#1E90FF",
    fontWeight: "600",
    marginTop: 10,
    textDecorationLine: "underline",
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
    alignItems: "center", // centers logo, name, tagline
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
    marginBottom: 4, // space between name and tagline
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
