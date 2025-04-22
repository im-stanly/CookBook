import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Text } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import MaterialIcons from '@expo/vector-icons/MaterialCommunityIcons';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const ICON_SIZE = 32;
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            height: 100,
            paddingTop: 10,
            borderTopWidth: 0,
          },
          android: {
            position: 'absolute',
            height: 100,
            paddingTop: 10,
            borderTopWidth: 0,
          },
          default: {
            // height: 100,
            flexDirection: 'column',
          },
        }),
      }}>
        <Tabs.Screen
        name="saved-recipes"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => <MaterialIcons size={ICON_SIZE} name="bookmark" color={color} />,
          tabBarLabel: ({ color }) => (
            <Text style={{ color, marginTop: 6, fontSize: 12 }}>Saved</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons size={ICON_SIZE} name="home" color={color} />,
          tabBarLabel: ({ color }) => (
            <Text style={{ color, marginTop: 6, fontSize: 12 }}>Home</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="add-button-placeholder"
        options={{
          tabBarIcon: () => null,
          tabBarButton: () => null,
          title: '',
        }}
      />
    </Tabs>
  );
}
