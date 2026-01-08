import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

interface AuthContextType {
  userToken: string | null;
  userData: any;
  isLoading: boolean;
  login: (token: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // 1. Check Login on App Start
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const user = await AsyncStorage.getItem('userData');
        if (token && user) {
          setUserToken(token);
          setUserData(JSON.parse(user));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuth();
  }, []);

  // 2. Protect Routes (Redirect if not logged in)
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!userToken && !inAuthGroup) {
      // If not logged in and not in auth group, go to login
      // We wait for the splash screen (index.tsx) to handle initial routing
    } else if (userToken && inAuthGroup) {
      // If logged in but in auth group, redirect to home
      router.replace('/(tabs)');
    }
  }, [userToken, segments, isLoading]);

  const login = async (token: string, user: any) => {
    setUserToken(token);
    setUserData(user);
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(user));
    router.replace('/(tabs)');
  };

  const logout = async () => {
    setUserToken(null);
    setUserData(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider value={{ userToken, userData, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};