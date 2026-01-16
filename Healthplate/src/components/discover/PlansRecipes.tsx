import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function PlansRecipes() {
  return (
    <View style={styles.container}>
      {/* AI planning row */}
      <View style={styles.aiRow}>
        <Text style={styles.subtitle}>AI-powered weekly planning</Text>

        {/* Disabled button for good UX */}
        <TouchableOpacity style={styles.generateBtnDisabled} disabled>
          <Text style={styles.generateText}>Generate (Coming Soon)</Text>
        </TouchableOpacity>
      </View>

      {/* Active plan card */}
      <View style={styles.cardActive}>
        <Text style={styles.cardTitle}>Jan week 1</Text>
        <Text style={styles.cardSub}>
          AI-generated meal plans will be available soon
        </Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>Coming Soon</Text>
        </View>
      </View>

      {/* Recipes preview */}
      <Text style={styles.section}>AI Recipes (Preview)</Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>Paneer Spinach Tomato Curry</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardText}>Dal Tadka with Brown Rice</Text>
      </View>

      {/* Footer note */}
      <Text style={styles.comingSoonText}>
        Personalized AI meal planning is coming soon 👨‍🍳✨
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  aiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  subtitle: {
    color: "#555",
    fontSize: 14,
  },

  generateBtnDisabled: {
    backgroundColor: "#d8b4fe",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  generateText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  cardActive: {
    backgroundColor: "#f3e8ff",
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  cardSub: {
    color: "#777",
    fontSize: 14,
  },

  badge: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#a855f7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  section: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
  },

  card: {
    backgroundColor: "#f6f6f6",
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
  },

  cardText: {
    fontSize: 14,
  },

  comingSoonText: {
    marginTop: 24,
    textAlign: "center",
    color: "#999",
    fontSize: 14,
  },
});
