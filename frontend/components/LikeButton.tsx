import { MaterialIcons } from "@expo/vector-icons";
import { use, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";
import axios from "axios";
import { API_URL } from "@/constants/URLs";
import { Recipe, useRecipes } from "@/contexts/RecipesContext";
import { useAuth } from "@/contexts/AuthContext";


export default function LikeButton({
    recipe
}: {
    recipe: Recipe
}) {

    const { authState } = useAuth();
    const { fetchRecipes } = useRecipes()
    const [likesCount, setLikesCount] = useState<string>(recipe.likesCount);
    const [dislikesCount, setDislikesCount] = useState<string>(recipe.dislikesCount);

    const [username, setUsername] = useState<string | null>(null);
    const [reaction, setReaction] = useState<"like" | "dislike" | null>(recipe.myReaction);

    useEffect(() => {
        if (authState && authState.username) {
            setUsername(authState.username);
        }
    }, [authState]);

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
                onPress={() => {
                    if (!username) {
                        console.warn("User is not authenticated");
                        return;
                    }
                    if (reaction === "like") {
                        setReaction(null);
                        setLikesCount(String(Number(likesCount) - 1));

                        axios.delete(`${API_URL}/recipe/${recipe.id}/react`, { params: { username: username } })
                    } else if (reaction === null) {
                        setReaction("like");
                        setLikesCount(String(Number(likesCount) + 1));

                        axios.post(`${API_URL}/recipe/${recipe.id}/react`, {}, { params: { isLike: true, username: username } })
                    } else if (reaction === "dislike") {
                        setReaction("like");
                        setLikesCount(String(Number(likesCount) + 1));
                        setDislikesCount(String(Number(dislikesCount) - 1));

                        // axios.delete(`${API_URL}/recipe/${recipe.id}/react`, { params: { username: username } })
                        axios.post(`${API_URL}/recipe/${recipe.id}/react`, {}, { params: { isLike: true, username: username } })
                    }
                }}
            >
                <MaterialIcons
                    name="arrow-upward"
                    size={34}
                    color={reaction === "like" ? "red" : "gray"}
                    style={{ paddingRight: 5 }}
                />
            </TouchableOpacity>
            <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: '#fff', paddingRight: 15 }}>{likesCount}</ThemedText>
            <TouchableOpacity
                onPress={() => {
                    if (!username) {
                        console.warn("User is not authenticated");
                        return;
                    }
                    if (reaction === "dislike") {
                        setReaction(null);
                        setDislikesCount(String(Number(dislikesCount) - 1));

                        axios.delete(`${API_URL}/recipe/${recipe.id}/react`, { params: { username: username } })
                    } else if (reaction === null) {
                        setReaction("dislike");
                        setDislikesCount(String(Number(dislikesCount) + 1));

                        axios.post(`${API_URL}/recipe/${recipe.id}/react`, {}, { params: { isLike: false, username: username } })
                    } else if (reaction === "like") {
                        setReaction("dislike");
                        setLikesCount(String(Number(likesCount) - 1));
                        setDislikesCount(String(Number(dislikesCount) + 1));

                        // axios.delete(`${API_URL}/recipe/${recipe.id}/react`, { params: { username: username } })
                        axios.post(`${API_URL}/recipe/${recipe.id}/react`, {}, { params: { isLike: false, username: username } })
                    }
                }}
            >
                <MaterialIcons
                    name="arrow-downward"
                    size={34}
                    color={reaction === "dislike" ? "blue" : "gray"}
                    style={{ paddingRight: 5 }}
                />
            </TouchableOpacity>
            <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: '#fff' }}>{dislikesCount}</ThemedText>
        </View>
    );

}