import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function SplashScreen() {
  const router = useRouter();
  const { userToken, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const timeout = setTimeout(() => {
      if (userToken) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timeout);
  }, [isLoading, userToken]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Healthplate</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  logo: { fontSize: 40, fontWeight: 'bold', color: '#4CAF50' },
});