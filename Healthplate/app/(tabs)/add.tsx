import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Coffee, Sun, Moon, Utensils, ArrowRight, CheckCircle } from 'lucide-react-native';

const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: Coffee },
  { id: 'lunch', label: 'Lunch', icon: Sun },
  { id: 'dinner', label: 'Dinner', icon: Moon },
  { id: 'snack', label: 'Snack', icon: Utensils },
];

export default function AddMeal() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [mealType, setMealType] = useState('');
  const [source, setSource] = useState('home');
  
  const submitMeal = async () => {
    try {
      const response = await fetch('YOUR_API_URL/logs/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: email,
          date: new Date().toISOString().split('T')[0],
          meal_type: mealType,
          source_type: source,
          components: [], // Simplified for demo
          calories: 0
        }),
      });
      if (response.ok) {
        Alert.alert("Success", "Meal logged successfully!");
      }
    } catch (e) {
      Alert.alert("Error", "Could not connect to server");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Step {step} of 2</Text>
      
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Who are you?</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your email" 
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TouchableOpacity 
            style={[styles.button, !email && { opacity: 0.5 }]} 
            disabled={!email}
            onPress={() => setStep(2)}
          >
            <Text style={styles.buttonText}>Continue</Text>
            <ArrowRight color="white" size={20} />
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>What did you eat?</Text>
          <View style={styles.grid}>
            {MEAL_TYPES.map((type) => (
              <TouchableOpacity 
                key={type.id}
                style={[styles.card, mealType === type.id && styles.activeCard]}
                onPress={() => setMealType(type.id)}
              >
                <type.icon color={mealType === type.id ? "#10b981" : "#6b7280"} size={32} />
                <Text style={styles.cardText}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={submitMeal}>
            <Text style={styles.buttonText}>Save Meal Log</Text>
            <CheckCircle color="white" size={20} />
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 20 },
  header: { fontSize: 14, color: '#6b7280', marginBottom: 10, marginTop: 40 },
  stepContainer: { flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#111827' },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47%', backgroundColor: 'white', padding: 20, borderRadius: 16, alignItems: 'center', borderSize: 2, borderColor: '#f3f4f6' },
  activeCard: { borderColor: '#10b981', backgroundColor: '#ecfdf5' },
  cardText: { marginTop: 10, fontWeight: '600' },
  button: { backgroundColor: '#111827', padding: 18, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  saveButton: { backgroundColor: '#10b981', padding: 18, borderRadius: 12, marginTop: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});