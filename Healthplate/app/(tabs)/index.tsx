import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

export default function HomeScreen() {
  const { userData } = useAuth();
  
  // Format Date: "Wednesday, 7 Jan"
  const today = new Date().toLocaleDateString('en-GB', { 
    weekday: 'long', day: 'numeric', month: 'short' 
  });

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{today}</Text>
      <Text style={styles.welcome}>Hello, {userData?.name || 'User'}!</Text>
      <Text style={styles.subtitle}>Healthplate</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#fff' },
  date: { fontSize: 16, color: 'gray' },
  welcome: { fontSize: 32, fontWeight: 'bold', marginTop: 5 },
  subtitle: { fontSize: 20, color: '#4CAF50', marginTop: 10 }
});