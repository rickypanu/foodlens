import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, Construction } from "lucide-react-native";

export default function TrendsTab() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <TrendingUp size={64} color="#cbd5e1" />
      </View>
      
      <Text style={styles.title}>Insights Coming Soon</Text>
      
      <Text style={styles.subtitle}>
        We are building advanced analytics to help you visualize your calorie history and macro trends.
      </Text>
      
      <View style={styles.badge}>
        <Text style={styles.badgeText}>IN DEVELOPMENT</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  iconContainer: {
    marginBottom: 24,
    backgroundColor: '#f1f5f9',
    padding: 24,
    borderRadius: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  badge: {
    backgroundColor: '#fff7ed',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#f97316',
    letterSpacing: 0.5,
  },
});