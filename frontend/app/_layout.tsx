import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Header } from 'react-native/Libraries/NewAppScreen';
import { useState } from 'react';
import { TextInput, View, Text, Button, Pressable } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const [page, setPage] = useState<'home' | 'recipe'>('home');
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {page === 'home' ? (
        <View 
          style={{ 
            flex: 1, 
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text>insert product</Text>
            <TextInput 
              style={{ 
                height: 40, 
                width: 200, 
                borderColor: 'gray', 
                borderWidth: 1, 
                padding: 10,
                margin: 10,
                borderRadius: 10,
              }}
              placeholder="Product Name"
            />
            <Pressable 
              style={{
                margin: 10,
                backgroundColor: 'green',
                padding: 10,
                borderRadius: 10,
              }}
              onPress={() => {
                setPage('recipe');
              }}
            > 
              <Text style={{ color: 'white' }}>get recipe</Text>
            </Pressable>
          </View>) : (
            <View 
            style={{ 
              flex: 1, 
              justifyContent: 'center',
              alignItems: 'center',
              }}>

              <Text>recipe</Text>
              
              <Pressable 
                style={{
                  margin: 10,
                  backgroundColor: 'green',
                  padding: 10,
                  borderRadius: 10,
                }}
                onPress={() => {
                  setPage('home');
                }}
              > 
                <Text style={{ color: 'white' }}>go back</Text>
            </Pressable>
          
          </View>
        )}
    </ThemeProvider>
  );
}
