import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from "expo-router";
const PremiumPlanScreen = () => {
   const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Crown Icon */}
      <Image
        source={require('@/assets/images/crown.png')} // Replace with your actual crown icon path
        style={styles.icon}
      />

      {/* Plan Title */}
      <Text style={styles.title}>Premium Plan</Text>

      {/* Plan Description */}
      <Text style={styles.description}>Full access to all features</Text>

      {/* Subscribe Button */}
      <TouchableOpacity style={styles.subscribeBtn}
      onPress={() => router.push("/SubscriptionChoice")}>

        <Text style={styles.subscribeText}>Upgrade Now</Text>
         
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  icon: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  subscribeBtn: {
    backgroundColor: '#FACC15',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: '#FACC15',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  subscribeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
});

export default PremiumPlanScreen;
