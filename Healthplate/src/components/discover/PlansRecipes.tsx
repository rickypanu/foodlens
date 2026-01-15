import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function PlansRecipes() {
  return (
    <View>
      <View style={styles.aiRow}>
        <Text style={styles.subtitle}>AI-powered weekly planning</Text>
        <TouchableOpacity style={styles.generateBtn}>
          <Text style={styles.generateText}>Generate</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardActive}>
        <Text style={styles.cardTitle}>Jan week 1</Text>
        <Text style={styles.cardSub}>Active meal plan</Text>
      </View>

      <Text style={styles.section}>AI Recipes</Text>
      <View style={styles.card}><Text>Paneer Spinach Tomato Curry</Text></View>
      <View style={styles.card}><Text>Dal Tadka with Brown Rice</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  aiRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  generateBtn: { backgroundColor: "#a855f7", padding: 8, borderRadius: 8 },
  generateText: { color: "#fff" },
  subtitle: { color: "#555" },
  cardActive: { backgroundColor: "#f3e8ff", padding: 16, borderRadius: 16, marginTop: 12 },
  cardTitle: { fontWeight: "700" },
  cardSub: { color: "#777" },
  section: { fontSize: 18, fontWeight: "700", marginTop: 16 },
  card: { backgroundColor: "#f6f6f6", padding: 12, borderRadius: 12, marginTop: 10 },
});