import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { ChefHat, Target, TrendingUp } from 'lucide-react-native';

const features = [
    {
      icon: ChefHat,
      title: 'Indian Meals First',
      desc: 'Built for roti, dal, curry & more'
    },
    {
      icon: Target,
      title: 'Know Your Goals',
      desc: 'Personalized targets for you'
    },
    {
      icon: TrendingUp,
      title: 'Weekly AI Insights',
      desc: 'Smart recommendations to improve'
    }
  ];

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
  }, 3000); 

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

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            {/* Icon Box */}
            <View style={styles.iconBox}>
              <feature.icon size={24} color="#059669" /> 
            </View>
            
            {/* Text Column */}
            <View style={styles.textColumn}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDesc}>{feature.desc}</Text>
            </View>
          </View>
        ))}
      </View>

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
  featuresContainer: {
    width: '100%',
    gap: 16, // Adds space between rows
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#ecfdf5', // Light emerald background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textColumn: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 13,
    color: '#6b7280',
  },
});
