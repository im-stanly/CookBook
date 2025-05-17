import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { ScrollView, View } from "react-native"
import { useEffect, useState } from "react";
import { useRecipes } from "@/contexts/RecipesContext"; 
import { RecipesProvider } from "@/contexts/RecipesContext";
import { Recipe } from "@/contexts/RecipesContext"; 

export default function RecipesScreen() {
    const { recipes, fetchRecipes } = useRecipes();

    useEffect(() => {
        const fetchData = async () => {
            // console.log("Starting fetch with ingredients:", 0);
            await fetchRecipes();
            // console.log("Fetch complete, recipes:", recipes.length);
        };
        
        fetchData();
    }, []); 

    //limit to 5 recipes
    const randomNumber = recipes.length > 5 ? Math.floor(Math.random() * (recipes.length - 5 + 1)) : 0;
    const limitedRecipes = recipes.slice(randomNumber, randomNumber + 5);

    return (
        <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
            <ScrollView style={{ flex: 1, padding: 16 }}> 
                {recipes.length === 0 ? (
                    <ThemedText>No recipes found.</ThemedText>
                ) : (
                    limitedRecipes.map((recipe, index) => (
                        <ThemedView key={index} style={{ margin: 10, padding: 10, borderRadius: 8 }}>
                            <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{recipe.name}</ThemedText>
                            <ThemedText style={{ marginBottom: 10 }}>
                                {recipe.description.split("Description: ")[1] || recipe.description}
                            </ThemedText>
                            <ThemedText>Likes: {recipe.likesCount}</ThemedText>
                            <ThemedText>Dislikes: {recipe.dislikesCount}</ThemedText>
                        </ThemedView>
                    ))
                )}
            </ScrollView>
        </View>
    )
}
