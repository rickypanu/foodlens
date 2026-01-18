import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
const PremiumPlanScreen = () => {
  const router = useRouter();
  return (
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
      <TouchableOpacity
        style={styles.upgradeButton}
        onPress={() => router.push("/SubscriptionChoice")}
      >
        <Text style={styles.upgradeBtnText}>Upgrade</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: "#FFF8E1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "97%",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 102,
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
  textWrapper: { flex: 1 },
  bannerTitle: {
    color: "#78350F",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
  },
  bannerSubtitle: { color: "#92400E", fontSize: 12 },
  upgradeButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  upgradeBtnText: { color: "#FFFFFF", fontWeight: "600", fontSize: 14 },
});

export default PremiumPlanScreen;
