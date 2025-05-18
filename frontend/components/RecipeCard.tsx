import React from "react";
import { ThemedText } from "@/components/ThemedText";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { View, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from "expo-router";
import { ThemedView } from "./ThemedView";
import { Recipe } from "@/contexts/RecipesContext";
import { Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get("window");
const { height: screenHeight } = Dimensions.get("window");

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
    const colorScheme = useColorScheme();
    const { name, description, likesCount, dislikesCount, ingredients } = recipe;
    
    const parseDescription = (text: string) => {
        const ingredientsMatch = text.match(/Ingredients: \[(.*?)\]/);
        const ingredientsList = ingredientsMatch 
            ? ingredientsMatch[1].split(',').map(ingredient => ingredient.trim().replace(/^'(.*)'$/, "$1").replace(/^"(.*)"$/, "$1"))
            : [];
        
        const descriptionMatch = text.match(/Description: ([\s\S]*)/);
        const descriptionText = descriptionMatch ? descriptionMatch[1] : text;
        
        return { ingredientsList, descriptionText };
    };

    const { ingredientsList, descriptionText } = parseDescription(description);

    console.log("Parsed ingredients:", ingredientsList);

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => 
                router.push({
                    pathname: "/recipe-details",
                    params: {
                        name,
                        ingredientsList: JSON.stringify(ingredientsList),
                        descriptionText,
                        likesCount,
                        dislikesCount,
                    },
                })
            }
            style={[
                styles.card,
                {
                    width: screenWidth * 0.85,
                    height: screenHeight * 0.60,
                    backgroundColor: colorScheme === 'light' ? '#222' : '#222'
                }
            ]}
        >
            <View style={{ 
                flex: 1, 
                padding: 10,
                marginHorizontal: 10, 
                justifyContent: "center",
            }}>
                {/* Title */}
                <View style={{ marginBottom: 20, paddingTop: 10 }}>
                    <ThemedText style={{ fontSize: 24, fontWeight: 'bold', color: '#fff'}}>{name}</ThemedText>
                </View>

                {/* Description */}
                <View>
                    <ThemedText numberOfLines={10} style={{ color: '#fff'}}>{descriptionText.replace(/\n/g, ' ')}</ThemedText>
                </View>

                {/* Ingredients */}
                {/* <View>
                    <ThemedText style={{ fontSize: 18, fontWeight: 'bold' }}>Ingredients:</ThemedText>
                    {ingredientsList.map((ingredient, index) => (
                        <ThemedText key={index}>{ingredient}</ThemedText>
                    ))}
                </View> */}

                <View style={{ marginBottom: 20, paddingTop: 10 }}>
                    <ThemedText numberOfLines={10} style={{ color: '#fff', fontWeight: 'bold'}}>click for more</ThemedText>
                </View>
            </View>



            {/* likes and other buttons */}
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 10, paddingRight: 10}}>
                <TouchableOpacity onPress={() => console.log("Like pressed")}>
                    <MaterialIcons name="favorite-border" size={34} color="gray" />
                </TouchableOpacity>
                <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: '#fff' }}>{likesCount}</ThemedText>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        padding: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingTop: 24,
    }
});