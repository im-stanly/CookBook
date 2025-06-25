import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState, useCallback } from "react";
import {
    TouchableOpacity, View, StyleSheet, TextInput,
    KeyboardAvoidingView, Platform, Keyboard, Pressable, FlatList,
    ActivityIndicator
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

export default function SearchIngredientsScreen() {
    const [inputedIngredient, setInputedIngredient] = useState<string>("");
    const [isIngredientSuggestionsLoading, setIsIngredientSuggestionsLoading] = useState(false);
    const [ingredientSuggestions, setIngredientSuggestions] = useState<string[]>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const { ingredientsState, setIngredientsState } = useIngredients();
    const { favIngredientsState, setFavIngredientsState } = useFavIngredients();

    const searchListItem = (item: string) => {
        const isInIngredientsList = ingredientsState?.ingredientList.some(
            (ingredient: any) => ingredient.name.toLowerCase() === item.toLowerCase()
        ) || false;

        return (
            <View style={[styles.container, { backgroundColor: '#222' }]}>
                <FavButton item={item} />
                <ThemedText style={styles.itemText}>{item}</ThemedText>
                <TouchableOpacity
                    onPress={() => {
                        Keyboard.dismiss();
                        router.push({
                            pathname: '/add-ingredient-modal',
                            params: { ingredientName: item }
                        });
                    }}
                    style={{
                        flex: 1,
                        alignItems: 'flex-end',
                        alignSelf: 'stretch',
                        justifyContent: 'center',
                    }}>
                    <MaterialIcons
                        name={isInIngredientsList ? "check" : "add"}
                        size={24}
                        color={isInIngredientsList ? "#4CAF50" : "gray"}
                        style={{ paddingRight: 15 }}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    const getIngredientSuggestions = (text: string) => {
        if (text.length < 3) {
            setIngredientSuggestions([]);
            setIsIngredientSuggestionsLoading(false);
            return;
        }

        text = text.trim().toLowerCase();
        text = text.replace(/[^a-zA-Z0-9\s]/g, "");
        text = text.replace(/[\u{1F600}-\u{1F64F}]/gu, "");

        setIsIngredientSuggestionsLoading(true);
        axios.get(`${API_URL}/recipe/ingredients/${text}`, {}).then((response) => {
            setIngredientSuggestions(Object.keys(response.data));
            console.log("Ingredient suggestions:", Object.keys(response.data));
            setIsIngredientSuggestionsLoading(false);
        })
    }

    const handleSearch = (text: string) => {
        getIngredientSuggestions(text);
        setInputedIngredient(text);
    };

    const clearInput = () => {
        setInputedIngredient("");
        setIngredientSuggestions([]);
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const renderItem = useCallback(({ item }: { item: string }) => searchListItem(item), [ingredientsState, favIngredientsState],);

    return (
        <ThemedView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1, marginBottom: Platform.OS === 'ios' ? 0 : 20 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 40}
                enabled={true}
            >
                <View style={{ flex: 1 }}>
                    <Pressable style={{ height: 100 }} onPress={dismissKeyboard}>
                        <View style={{ height: 100 }} />
                    </Pressable>

                    <View style={{ width: '100%', marginBottom: 20, overflow: 'visible', }}>
                        <ThemedText
                            style={{
                                paddingTop: 20,
                                paddingLeft: 20,
                                fontSize: 40,
                                fontWeight: 'bold',
                                overflow: 'visible',
                                textAlign: 'left'
                            }}>
                            Search
                        </ThemedText>
                    </View>
                    {ingredientSuggestions.length === 0
                        && inputedIngredient.length < 2
                        && !isIngredientSuggestionsLoading
                        && !isSearchFocused ? (

                        <View style={styles.loadingContainer}>
                            <MaterialIcons
                                name="search"
                                size={100}
                                color="#666"
                                style={{ opacity: 0.5, overflow: 'visible' }}
                            />
                            <ThemedText style={{ color: '#666', marginTop: 20, textAlign: 'center' }}>
                                Start typing to search for ingredients
                            </ThemedText>
                        </View>
                    ) : null}

                    {isIngredientSuggestionsLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator
                                size="large"
                                color="#666"
                            />
                        </View>
                    ) : (
                        ingredientSuggestions.length === 0 && inputedIngredient.length > 2 ? (
                            <View style={styles.loadingContainer}>
                                <ThemedText style={{ color: '#666', textAlign: 'center' }}>
                                    Nothing found for "{inputedIngredient}"
                                </ThemedText>
                            </View>
                        ) : (
                            <FlatList
                                data={ingredientSuggestions}
                                keyExtractor={(item) => item}
                                style={{ width: '100%', flex: 1 }}
                                contentContainerStyle={{ paddingHorizontal: 20 }}
                                renderItem={renderItem}
                                scrollEnabled={true}
                                removeClippedSubviews={false}
                                keyboardShouldPersistTaps="handled"
                                maxToRenderPerBatch={10}
                            />
                        )
                    )}
                </View>

                <View style={styles.searchContainer}>
                    {isSearchFocused && ingredientSuggestions.length === 0 && inputedIngredient.length < 3 ? (
                        <View style={{ paddingBottom: 20, alignItems: 'center' }}>
                            <ThemedText style={{ color: '#666', textAlign: 'center' }}>
                                Ingredient name must be at least 3 characters
                            </ThemedText>
                        </View>
                    ) : null}
                    <View style={styles.searchBox}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search for ingredients..."
                            placeholderTextColor="#999"
                            value={inputedIngredient}
                            onChangeText={(text) => handleSearch(text)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            onSubmitEditing={() => { }}
                            autoCorrect={true}
                            autoCapitalize="none"
                            returnKeyType="done"
                        />
                        <TouchableOpacity
                            onPress={isSearchFocused && inputedIngredient ? clearInput : () => { }}
                            style={styles.searchButton}
                        >
                            <MaterialIcons
                                name={isSearchFocused && inputedIngredient ? "clear" : "search"}
                                size={24}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ThemedView>
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