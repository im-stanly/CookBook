import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";
import axios from "axios";
import { API_URL } from "@/constants/URLs";
import { Recipe, useRecipes } from "@/contexts/RecipesContext";


export default function LikeButton({
    recipe
}: {
    recipe: Recipe
}) {

    const { fetchRecipes } = useRecipes()
    //TODO: Consider users other than Andrzej
    const username = "Andrzej";

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
                onPress={() => {
                    if (recipe.myReaction === "like") {
                        axios.delete(`${API_URL}/recipe/${recipe.id}/react`, { params: { username: username } }).then((r) => {
                            fetchRecipes();
                        })
                    } else {
                        axios.post(`${API_URL}/recipe/${recipe.id}/react`, {}, { params: { isLike: true, username: username } })
                            .then((r) => {
                                fetchRecipes();
                            })
                    }
                }}
            >
                <MaterialIcons
                    name="arrow-upward"
                    size={34}
                    color={recipe.myReaction === "like" ? "red" : "gray"}
                    style={{ paddingRight: 5 }}
                />
            </TouchableOpacity>
            <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: '#fff', paddingRight: 15 }}>{recipe.likesCount}</ThemedText>
            <TouchableOpacity
                onPress={() => {
                    if (recipe.myReaction === "dislike") {
                        axios.delete(`${API_URL}/recipe/${recipe.id}/react`, { params: { username: username } })
                            .then((r) => {
                                fetchRecipes();
                            })
                    } else {
                        axios.post(`${API_URL}/recipe/${recipe.id}/react`, {}, { params: { isLike: false, username: username } })
                            .then((r) => {
                                fetchRecipes();
                            })
                    }
                }}
            >
                <MaterialIcons
                    name="arrow-downward"
                    size={34}
                    color={recipe.myReaction === "dislike" ? "blue" : "gray"}
                    style={{ paddingRight: 5 }}
                />
            </TouchableOpacity>
            <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: '#fff' }}>{recipe.dislikesCount}</ThemedText>
        </View>
    );

}