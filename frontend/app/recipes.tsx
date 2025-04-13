import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { RecipeView } from '@/components/RecipeView';
import { NoRecipeFoundView } from '@/components/NoRecipeFoundView';
import { router, useLocalSearchParams } from 'expo-router';

//TODO: Actually get the recipe from the server
function getRecipe(ingredients: string[]): { name: string, description: string, ingredients: string[], steps: string[] } | null {
	if (ingredients.lastIndexOf("banana") !== -1) {
		return { name: "Banana", description: "Long, yellow, and tasty fruit.", ingredients: ["banana"], steps: ["Open the banana", "Eat the banana"] };
	}
	else {
		return null;
	}
}

export default function Recipes() {
    const { ingredients : ingredientsParam } = useLocalSearchParams();
    const ingredients = ingredientsParam ? JSON.parse(ingredientsParam as string) : [];

    const recipe = getRecipe(ingredients);

    return (
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
                    router.back();
                }}
            >
                <Text style={{ color: 'white' }}>go back</Text>
            </Pressable>

        </View>
    );
} 