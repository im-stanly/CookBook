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
import { RecipeView } from '@/components/RecipeView';
import { NoRecipeFoundView } from '@/components/NoRecipeFoundView';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

//TODO: Actually get the recipe from the server
function getRecipe(ingredients: string[]): { name: string, description: string, ingredients: string[], steps: string[] } | null {
	if (ingredients.lastIndexOf("banana") !== -1) {
		return { name: "Banana", description: "Long, yellow, and tasty fruit.", ingredients: ["banana"], steps: ["Open the banana", "Eat the banana"] };
	}
	else {
		return null;
	}
}

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});
	const [page, setPage] = useState<'home' | 'recipe'>('home');
	const [Ingredients, setIngredients] = useState<string[]>([]);
	//TODO: Handle multiple ingredients
	const [input, setInput] = useState<string>('');

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	const recipe = getRecipe(Ingredients);

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
						value={input}
						placeholder="Product Name"
						onChangeText={(text) => setInput(text)}
					/>
					<Pressable
						style={{
							margin: 10,
							backgroundColor: 'green',
							padding: 10,
							borderRadius: 10,
						}}
						onPress={() => {
							setIngredients([input]);
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
					{recipe ? RecipeView(recipe) : NoRecipeFoundView()}
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
