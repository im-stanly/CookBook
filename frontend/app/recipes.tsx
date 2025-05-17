import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { ScrollView, View } from "react-native"
import { useEffect, useState } from "react";
import { useRecipes } from "@/contexts/RecipesContext"; 
import { Dimensions } from "react-native"
import { Recipe } from "@/contexts/RecipesContext"; 
import RecipeCard from "@/components/RecipeCard";
import ReanimatedCarousel from 'react-native-reanimated-carousel';

const { width: screenWidth } = Dimensions.get("window");
const { height: screenHeight } = Dimensions.get("window");

export default function RecipesScreen() {
    const { recipes, fetchRecipes } = useRecipes();

    useEffect(() => {
        const fetchData = async () => {
            await fetchRecipes();
        };
        fetchData();
    }, []); 

    //limit to 5 recipes
    const randomNumber = recipes.length > 5 ? Math.floor(Math.random() * (recipes.length - 5 + 1)) : 0;
    const limitedRecipes = recipes.slice(randomNumber, randomNumber + 5);

    return (
        <ThemedView style={{ flex: 1, padding: 20, justifyContent: "center" }}>
            {limitedRecipes.length === 0 ? (
                <ThemedText>No recipes found.</ThemedText>
            ) : (
                <ReanimatedCarousel
                    width={screenWidth * 0.85}
                    height={screenHeight * 0.60}
                    data={limitedRecipes}
                    renderItem={({ item }: { item: Recipe }) => <RecipeCard recipe={item} />}
                    style={{
                        alignSelf: 'center',
                        overflow: "visible", 
                    }}
                    loop={false}
                    mode="parallax"
                    modeConfig={{
                        parallaxScrollingScale: 0.9,
                        parallaxScrollingOffset: 40, 
                    }}
                />
            )}
        </ThemedView>
    )
}
