import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ScrollView, View } from "react-native";
import { useEffect, useState } from "react";
import { Recipe } from "@/contexts/RecipesContext";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function RecipeDetailsScreen() {
    const colorScheme = useColorScheme();
    const { name, ingredientsList, descriptionText, likesCount } = useLocalSearchParams();

    const ingredients = ingredientsList ? JSON.parse(ingredientsList as string) : [];

    return (
        <ScrollView style={{ flex: 1, padding: 30, paddingTop: 60, backgroundColor: colorScheme === 'light' ? '#fff' : '#000' }}
                contentContainerStyle={{ paddingBottom: 100 }}>
            <ThemedText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>{name}</ThemedText>
            <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Ingredients:</ThemedText>
            {ingredients.map((ingredient: string, idx: number) => (
                <ThemedText key={idx}>• {ingredient}</ThemedText>
            ))}
            <ThemedText style={{ fontSize: 18, marginTop: 20, marginBottom: 50 }}>{descriptionText}</ThemedText>
        </ScrollView>
    )
}