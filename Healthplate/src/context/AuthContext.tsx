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

  // 2. Protect Routes (Redirect logic)
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    // If not logged in & not in auth group (logic handled by specific screens usually)
    if (!userToken && !inAuthGroup) {
      // optional: router.replace('/(auth)/login'); 
    } 
    // If logged in & trying to access auth screens, redirect to home
    else if (userToken && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [userToken, segments, isLoading]);

  // --- MISSING PART RESTORED BELOW ---
  
  const login = async (token: string, user: any) => {
    // Update State
    setUserToken(token);
    setUserData(user);
    
    // Save to Storage
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(user));

    // NOTE: We do NOT redirect here anymore. 
    // The specific screen (Login or Subscribe) will handle the redirect.
  };

  // ------------------------------------

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