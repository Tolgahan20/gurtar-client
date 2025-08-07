import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useRootNavigationState, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

interface AuthContextType {
  isSignedIn: boolean;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    if (!navigationState?.key || isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    if (!isSignedIn && !inAuthGroup) {
      // Redirect to the login page if not signed in
      router.replace('/login');
    } else if (isSignedIn && inAuthGroup) {
      // Redirect to the home page if signed in
      router.replace('/(tabs)');
    }
  }, [isSignedIn, segments, navigationState?.key, isLoading]);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      setIsSignedIn(!!token);
    } catch (error) {
      console.error('Error checking token:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (token: string) => {
    try {
      await AsyncStorage.setItem('access_token', token);
      setIsSignedIn(true);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      setIsSignedIn(false);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Show loading screen while checking authentication or waiting for navigation
  if (isLoading || !navigationState?.key) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ isSignedIn, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
} 