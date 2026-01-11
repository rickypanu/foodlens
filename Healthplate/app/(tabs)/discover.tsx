import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

// IMPORT YOUR 3 NEW FILES HERE
import PlansRecipes from '../discoversub/PlansRecipes';
import NutritionGuide from '../discoversub/NutritionGuide';
import Community from '../discoversub/Community';
import CustomHeader from "@/src/components/header";

export default function DiscoverScreen() {
  const [tab, setTab] = useState("nutrition");

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <Text style={styles.logo}>Healthplate</Text>
      <Text style={styles.tagline}>Made for Indian meals. Built for better health.</Text>
      <Text style={styles.title}>Discover</Text> */}
      <CustomHeader/>
      <Text style={styles.title}>Discover</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Tab label="Plans & Recipes" active={tab === "plans"} onPress={() => setTab("plans")} />
        <Tab label="Nutrition Guide" active={tab === "nutrition"} onPress={() => setTab("nutrition")} />
        <Tab label="Community" active={tab === "community"} onPress={() => setTab("community")} />
      </View>

      {/* Content Area */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {tab === "plans" && <PlansRecipes />}
        {tab === "nutrition" && <NutritionGuide />}
        {tab === "community" && <Community />}
      </ScrollView>
    </View>
  );
}

function Tab({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  logo: { fontSize: 22, fontWeight: "700", color: "#1aa37a" },
  tagline: { color: "#777", marginBottom: 12 },
  title: { fontSize: 26, fontWeight: "700", marginVertical: 12 },
  tabs: { flexDirection: "row", marginBottom: 16 },
  tab: { paddingVertical: 6, paddingHorizontal: 12, marginRight: 8, borderRadius: 20, backgroundColor: "#eee" },
  tabActive: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd" },
  tabText: { color: "#777" },
  tabTextActive: { color: "#000", fontWeight: "600" },
});