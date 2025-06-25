import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ScrollView, View } from "react-native";
import { useEffect, useState } from "react";
import { Recipe } from "@/contexts/RecipesContext";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function RecipeDetailsScreen() {
    const colorScheme = useColorScheme();
    const { name, ingredientsList, description, likesCount, ingredientMatch } = useLocalSearchParams();

    const matchColor = Number(ingredientMatch) >= 85 ? 'green' : Number(ingredientMatch) >= 66 ? 'orange' : 'red';


    return (
        <ScrollView style={{ flex: 1, padding: 30, paddingTop: 60, backgroundColor: colorScheme === 'light' ? '#fff' : '#000' }}
                contentContainerStyle={{ paddingBottom: 100 }}>
            <ThemedText style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>{name}</ThemedText>
            {/* <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Ingredients:</ThemedText>
            {ingredients.map((ingredient: string, idx: number) => (
                <ThemedText key={idx}>• {ingredient}</ThemedText>
            ))} */}
            <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 30 }}>
                <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>Ingredients: </ThemedText>
                <ThemedText style={{ fontSize: 18, fontWeight: 'bold', color: matchColor }}>{ingredientMatch}%</ThemedText>    
            </View>
            <ThemedText style={{ fontSize: 18 }}>{description.split("Description: ")[0].replace("Ingredients: ", "")}</ThemedText>
            
            <View style={{ flexDirection: 'row', marginTop: 30 }}>
                <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>Description:</ThemedText>
            </View>
            <ThemedText style={{ fontSize: 18, marginTop: 10 }}>{description.split("Description: ")[1]}</ThemedText>
        </ScrollView>
    )
}