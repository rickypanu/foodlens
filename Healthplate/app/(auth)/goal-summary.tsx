import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GoalSummary() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Parse the data passed from Signup
  const metrics = params.goals ? JSON.parse(params.goals as string) : {};
  const token = params.token as string;
  const user = params.user as string;

  const handleContinue = () => {
    // Pass the credentials forward to the subscription page
    router.push({ 
      pathname: '/(auth)/subscribe',
      params: { token, user } 
    });
  };

  const renderMetricCard = (label: string, value: string, unit: string, color: string, icon: any) => (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={[styles.iconBox, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="#fff" />
      </View>
      <View>
        <Text style={styles.cardLabel}>{label}</Text>
        <Text style={styles.cardValue}>{value} <Text style={styles.unit}>{unit}</Text></Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Your Personalized Plan</Text>
        <Text style={styles.subHeader}>Based on your profile, here are your daily targets:</Text>

        <View style={styles.highlightBox}>
          <Text style={styles.caloriesLabel}>Daily Calories</Text>
          <Text style={styles.caloriesValue}>{metrics.daily_calories || 2000}</Text>
          <Text style={styles.caloriesUnit}>Kcal / day</Text>
        </View>

        <View style={styles.grid}>
          {renderMetricCard("Protein", metrics.protein_target || "0", "g", "#FF6B6B", "fitness")}
          {renderMetricCard("Fiber", metrics.fiber_target || "30", "g", "#4ECDC4", "leaf")}
          {renderMetricCard("Sugar Cap", metrics.sugar_cap || "50", "g", "#FFD93D", "warning")}
          {renderMetricCard("Sodium", "2300", "mg", "#6C5CE7", "water")}
        </View>

        <Text style={styles.disclaimer}>
          These values are estimates based on the Mifflin-St Jeor equation.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn} onPress={handleContinue}>
          <Text style={styles.btnText}>View Plans</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  subHeader: { fontSize: 16, color: '#666', marginBottom: 30 },
  
  highlightBox: {
    backgroundColor: '#f8fdf9', padding: 30, borderRadius: 20, alignItems: 'center', marginBottom: 30,
    borderWidth: 1, borderColor: '#4CAF50', borderStyle: 'dashed'
  },
  caloriesLabel: { fontSize: 16, textTransform: 'uppercase', color: '#4CAF50', fontWeight: 'bold' },
  caloriesValue: { fontSize: 48, fontWeight: 'bold', color: '#333', marginVertical: 5 },
  caloriesUnit: { fontSize: 14, color: '#888' },

  grid: { gap: 15 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', 
    padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#f0f0f0',
    borderLeftWidth: 5, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5
  },
  iconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardLabel: { fontSize: 14, color: '#666' },
  cardValue: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  unit: { fontSize: 12, color: '#888', fontWeight: 'normal' },

  disclaimer: { textAlign: 'center', marginTop: 30, color: '#aaa', fontSize: 12 },

  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  btn: { 
    backgroundColor: '#333', borderRadius: 50, height: 56, 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 
  },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});