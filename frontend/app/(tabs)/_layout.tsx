import { router, Tabs } from 'expo-router';
import React from 'react';
import { Platform, TouchableOpacity, DimensionValue, StyleSheet, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { View } from 'react-native';
import { Sizes } from '@/constants/Add-button-sizes';


const TABBAR_HEIGHT = Sizes.TABBAR_HEIGHT;
const ICON_SIZE = Sizes.ICON_SIZE as number;
const ADDBTN_BOTTOM_OFFSET = Sizes.ADDBTN_BOTTOM_OFFSET as DimensionValue;
const ADDBTN_RIGHT_OFFSET = Sizes.ADDBTN_RIGHT_OFFSET as DimensionValue;
const ADDBTN_SIZE = Sizes.BTN_SIZE;

const AddButton = ({ onPress } : { onPress?: () => void}) => (
  <TouchableOpacity
    style={styles.addButtonContainer}
    onPress={onPress}
    activeOpacity={0.7}>
      <View style={styles.addButton}>
        <MaterialIcons
          name="add"
          size={ICON_SIZE - 4}
          color="white"
        />
      </View>
  </TouchableOpacity>
);

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colorScheme === 'light' ? '#2C2C2E' : Colors.dark.tint,
          headerShown: false,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
              height: TABBAR_HEIGHT,
              paddingTop: 10,
              borderTopWidth: 0,
            },
            android: {
              position: 'absolute',
              height: TABBAR_HEIGHT,
              paddingTop: 10,
              borderTopWidth: 0,
            },
            default: {
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
            tabBarIcon: ({ color }) => <MaterialIcons size={ICON_SIZE} name="food-bank" color={color} />,
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
      <AddButton
        onPress={() => {
          router.push('/add-action-modal');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addButtonContainer: {
    position: 'absolute',
    bottom: ADDBTN_BOTTOM_OFFSET,
    right: ADDBTN_RIGHT_OFFSET,
  },

  addButton: {
    width: ADDBTN_SIZE,
    height: ADDBTN_SIZE,
    borderRadius: ADDBTN_SIZE / 2,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },

});