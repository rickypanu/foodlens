import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function SplashScreen() {
  const router = useRouter();
  const { userToken, isLoading } = useAuth();

useEffect(() => {
  if (isLoading) return;

  const timer = setTimeout(() => {
    if (userToken) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/login');
    }
  }, 3000); // 1.5 seconds

  return () => clearTimeout(timer);
}, [isLoading, userToken]);


  return (
    <View style={styles.container}>
      {/* LOGO */}
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />

      {/* APP NAME */}
      <Text style={styles.logoText}>Healthplate</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000ff',
  },
});
