import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { View } from "react-native"
import axios from "axios";
import { useEffect, useState } from "react";
import { Ingredient, useIngredients } from "@/contexts/IngredientsContext";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/constants/URLs";

export type RecipeIngredient = {
    name: string,
    unitName: string,
    amountRangeStart: string,
    amountRangeEnd: string,
    preciseIngredientName: string,
    approximateCaloriesPer100Gram: string
}

export type Recipe = {
    name: string,
    description: string,
    likesCount: string,
    dislikesCount: string,
    ingredients: RecipeIngredient[],
}

export default function RecipesScreen() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const { ingredientList } = useIngredients().ingredientsState!;

    const fetchRecipes = async () => {
        try {
            const payload = ingredientList.map(({ id, name, quantity, unit}) => ({
                name: name,
                unit: unit, 
                amount: quantity,
            }));
    
            const response = await axios.get(`${API_URL}/recipe/all`, {});
            
            
            const fetchedRecipes: Recipe[] = response.data.map((item: any) => ({
                name: item.name,
                description: item.description,
                likesCount: String(item.likesCount),
                dislikesCount: String(item.dislikesCount),
                ingredients: item.ingredients.map((ing: any) => ({
                    name: ing.name,
                    unitName: ing.unitName,
                    amountRangeStart: String(ing.amountRangeStart),
                    amountRangeEnd: String(ing.amountRangeEnd),
                    preciseIngredientName: ing.preciseIngredientName,
                    approximateCaloriesPer100Gram: String(ing.approximateCaloriesPer100Gram),
                })),
            }));
    
            // setRecipesState({ recipes: fetchedRecipes });
            console.log("Fetched recipes:", response.data);
            return fetchedRecipes;
        } catch (e) {
            console.error("Failed to fetch recipes:", e);
            return [];
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedRecipes = await fetchRecipes();
                setRecipes(fetchedRecipes);
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
        };
    
        fetchData();
    }, [])

    return (
        <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
            {recipes.length === 0 ? (
                <ThemedText>No recipes found.</ThemedText>
            ) : (
                recipes.map((recipe, index) => (
                    <ThemedView key={index} style={{ margin: 10, padding: 10, borderRadius: 8 }}>
                        <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>{recipe.name}</ThemedText>
                        <ThemedText>{recipe.description}</ThemedText>
                        <ThemedText>Likes: {recipe.likesCount}</ThemedText>
                        <ThemedText>Dislikes: {recipe.dislikesCount}</ThemedText>
                        {recipe.ingredients.map((ing: RecipeIngredient, id: number) => (
                            <ThemedText key={id} style={{ marginLeft: 10 }}>{ing.name}: {ing.unitName}</ThemedText>
                        ))}
                    </ThemedView>
                ))
            )}
        </View>
    )
}
