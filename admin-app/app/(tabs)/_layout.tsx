import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import { useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (segments.length > 0) {
      setIsReady(true);
    }
  }, [segments]);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isReady]);

  return (
    isAuthenticated && (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="products"
          options={{
            title: 'Productos',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="text.document.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="users"
          options={{
            title: 'Usuarios',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="character" color={color} />,
          }}
        />
        <Tabs.Screen
          name="register"
          options={{
            title: 'Registrar orden',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="checklist" color={color} />,
          }}
        />
      </Tabs>
    )
  );
}
