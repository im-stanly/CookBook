import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState, useCallback } from "react";
import {
    TouchableOpacity, View, StyleSheet, TextInput,
    KeyboardAvoidingView, Platform, Keyboard, Pressable, FlatList,
    ActivityIndicator,
    Text
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useIngredients } from "@/contexts/IngredientsContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { IngredientsProvider } from "@/contexts/IngredientsContext";
import { API_URL } from "@/constants/URLs";
import axios from "axios";
import { router } from "expo-router";
import { FavIngredient, useFavIngredients } from "@/contexts/FavIngredientsContext";
import FavButton from "@/components/FavButton";

export default function FavIngredients() {

    const colorScheme = useColorScheme();
    const { favIngredientsState, setFavIngredientsState } = useFavIngredients();

    const renderItem = ({ item }: { item: string }) => {
        return (
            <TouchableOpacity style={[styles.container, { backgroundColor: colorScheme === 'light' ? '#222' : '#222' }]}
                onPress={() => {
                    router.push({
                        pathname: '/add-ingredient-modal',
                        params: { ingredientName: item }
                    });
                }}>
                <FavButton item={item} />
                <ThemedText style={styles.itemText}>{item}</ThemedText>
            </TouchableOpacity>
        );

    }

    return (
        <View>
            <ThemedText
                style={{
                    fontSize: 40,
                    fontWeight: 'bold',
                    textAlign: 'left',
                    paddingTop: 40,
                    overflow: 'visible',
                    lineHeight: 48,
                    paddingLeft: 20,
                    width: '80%',
                }}
            >
                Favorite Ingredients
            </ThemedText>
            <FlatList
                data={favIngredientsState!.favIngredientList.map((ingredient: FavIngredient) => ingredient.name)}
                keyExtractor={(item) => item}
                renderItem={renderItem}
                inverted={true}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        padding: 20,
        paddingBottom: 40,
        backgroundColor: 'transparent',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#222',
        borderRadius: 18,
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
        paddingVertical: 5,
    },
    searchButton: {
        padding: 5,
        marginLeft: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        overflow: 'visible',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        padding: 20,
        borderWidth: 0,
        borderRadius: 18,
        marginTop: 10,
        minHeight: 64,
    },
    itemText: {
        fontSize: 18,
        marginRight: 10,
        flex: 1,
        color: '#fff',
        textAlignVertical: 'center',
    },
});