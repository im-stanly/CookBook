import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useRouter, useSegments } from 'expo-router';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { IngredientsProvider } from '@/contexts/IngredientsContext';
import { RecipesProvider } from '@/contexts/RecipesContext';

SplashScreen.preventAutoHideAsync();
SystemUI.setBackgroundColorAsync('#transparent');

export default function RootLayout() {
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

  return (
    <AuthProvider>
      <IngredientsProvider>
        <RecipesProvider>
          <Layout></Layout>
        </RecipesProvider>
      </IngredientsProvider>
    </AuthProvider>
  );
}

export const Layout = () => {
  const colorScheme = useColorScheme();
  const { authState } = useAuth();

  if (authState?.loading === true || authState?.authenticated === null) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} initialRouteName={"login"}>
        {authState?.authenticated ? (
          [
            <Stack.Screen key="tabs" name="(tabs)" options={{ headerShown: false }} />,
            <Stack.Screen
              key="add-action-modal"
              name="add-action-modal"
              options={{
                presentation: 'transparentModal',
                headerShown: false,
                animation: 'fade',
              }}
            />,
            <Stack.Screen key="search-ingredient" name="search-ingredient" options={{
              presentation: 'transparentModal',
              headerShown: false,
              animation: 'fade',
            }} />,
            <Stack.Screen 
              key='recipes'
              name='recipes'
              options={{
                animation: 'slide_from_right',
                headerShown: false,
              }}
            />,
          ]
        ) : (
          [
            <Stack.Screen key="login" name="login" options={{ headerShown: false, animation: 'slide_from_bottom' }} />,
            <Stack.Screen key="register" name="register" options={{ headerShown: false, animation: 'none' }} />,
          ]
        )}
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
