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
import { IngredientSelector } from '@/components/IngredientSelector';
import { IngredientList } from '@/components/IngredientList';

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

//TODO: Get the possible ingredients from the server
function getPossibleIngredients(): string[] {
	return ["banana", "potato"];
}

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});
	const [page, setPage] = useState<'home' | 'recipe'>('home');
	const [Ingredients, setIngredients] = useState<string[]>([]);

	const possible_ingredients = getPossibleIngredients();

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
					<IngredientList ingredients={Ingredients} />
					<IngredientSelector possible_ingredients={possible_ingredients} add_ingredient={(i) => {
						if (Ingredients.indexOf(i) === -1) {
							const new_ings = Ingredients.slice();//Without this, the state is not updated
							new_ings.push(i);
							setIngredients(new_ings)
						}
					}} />
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
