import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext'; // Import Context

export default function SubscribeScreen() {
  const [selected, setSelected] = useState('free');
  const params = useLocalSearchParams();
  const { login } = useAuth(); // Get login function

  const handleStart = async () => {
    // Check if we have the token passed from Signup
    const token = params.token as string;
    const userStr = params.user as string;

    if (token && userStr) {
      try {
        // This function saves the token and redirects to (tabs)/index automatically
        await login(token, JSON.parse(userStr)); 
      } catch (error) {
        Alert.alert("Error", "Could not sign you in automatically. Please log in manually.");
      }
    } else {
      // If no token (e.g., coming from somewhere else), just alert
      Alert.alert("Development Mode", "No payment integration yet. Please Login.");
    }
  };

  const PlanOption = ({ id, title, price, duration, isBestValue }: any) => (
    <TouchableOpacity 
      style={[styles.option, selected === id && styles.optionSelected]} 
      onPress={() => setSelected(id)}
    >
      <View style={styles.radio}>
        {selected === id && <View style={styles.radioInner} />}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.planTitle, selected === id && styles.textSelected]}>{title}</Text>
        <Text style={styles.planDuration}>{duration}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={[styles.price, selected === id && styles.textSelected]}>{price}</Text>
        {isBestValue && <View style={styles.badge}><Text style={styles.badgeText}>Best Value</Text></View>}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>Unlock your full potential with Healthplate Premium.</Text>
      </View>

      <View style={styles.content}>
        <PlanOption 
          id="free" 
          title="Free Trial" 
          price="₹0" 
          duration="5 Days" 
        />
        <PlanOption 
          id="monthly" 
          title="Monthly" 
          price="₹50" 
          duration="/ month" 
        />
        <PlanOption 
          id="yearly" 
          title="Yearly" 
          price="₹480" 
          duration="/ year" 
          isBestValue={true}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.terms}>
          By continuing, you agree to the Terms of Service. No payment required today for Free Trial.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={handleStart}>
          <Text style={styles.btnText}>Start Free Trial</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'space-between' },
  header: { padding: 24, paddingTop: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', lineHeight: 24 },
  
  content: { paddingHorizontal: 24, gap: 15 },
  
  option: {
    flexDirection: 'row', alignItems: 'center', padding: 20,
    borderWidth: 1, borderColor: '#eee', borderRadius: 16, backgroundColor: '#fafafa'
  },
  optionSelected: {
    borderColor: '#4CAF50', backgroundColor: '#f0fbf2', borderWidth: 2
  },
  
  radio: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#ccc',
    marginRight: 15, justifyContent: 'center', alignItems: 'center'
  },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4CAF50' },
  
  planTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  textSelected: { color: '#2E7D32' },
  planDuration: { fontSize: 14, color: '#888' },
  price: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  
  badge: { backgroundColor: '#FFD700', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, marginTop: 5 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#333' },

  footer: { padding: 24, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  terms: { fontSize: 12, color: '#aaa', textAlign: 'center', marginBottom: 15 },
  btn: { 
    backgroundColor: '#4CAF50', borderRadius: 50, height: 56, 
    alignItems: 'center', justifyContent: 'center', shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8
  },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});