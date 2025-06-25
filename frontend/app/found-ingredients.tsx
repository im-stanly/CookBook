import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
    TouchableOpacity, View, StyleSheet, FlatList,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router } from "expo-router";
import FavButton from "@/components/FavButton";
import { FoundIngredient, useFoundIngredients } from "@/contexts/FoundIngredientsContext";

export default function FoundIngredients() {

    const colorScheme = useColorScheme();
    const { foundIngredients } = useFoundIngredients();

    const renderItem = ({ item }: { item: FoundIngredient }) => {
        return (
            <TouchableOpacity style={[styles.container, { backgroundColor: colorScheme === 'light' ? '#222' : '#222' }]}
                onPress={() => {
                    router.push({
                        pathname: '/add-ingredient-modal',
                        params: { ingredientName: item.name, unit: item.unit }
                    });
                }}>
                <FavButton item={item.name} />
                <ThemedText style={styles.itemText}>{item.name}: {item.unit}</ThemedText>
            </TouchableOpacity>
        );

    }

    return (
        <ThemedView style={{ flex: 1 }}>
            {foundIngredients.length > 0 ?
                <View style={{ flex: 1, marginTop: 100 }}>
                    <View style={{ width: '100%', marginBottom: 20, overflow: 'visible', }}>
                        <ThemedText
                            style={{
                                paddingTop: 20,
                                paddingLeft: 20,
                                fontSize: 40,
                                fontWeight: 'bold',
                                overflow: 'visible',
                                textAlign: 'left',
                                lineHeight: 48,
                            }}>
                            Found Ingredients:
                        </ThemedText>
                    </View>

                    <FlatList
                        data={foundIngredients}
                        // keyExtractor={(item) => item.name + item.unit}
                        style={{ width: '100%', flex: 1 }}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                        renderItem={renderItem}
                        inverted={false}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
                :
                <View style={styles.loadingContainer}>
                    <ThemedText style={{ fontSize: 20, color: '#fff' }}>No ingredients found.</ThemedText>
                </View>
            }
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