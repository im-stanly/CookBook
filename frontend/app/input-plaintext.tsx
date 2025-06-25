import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useFoundIngredients } from "@/contexts/FoundIngredientsContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { TextInput, View, TouchableOpacity } from "react-native";

export default function InputPlaintext() {

    const colorScheme = useColorScheme();
    const { foundIngredients, fetchFoundIngredientsByText } = useFoundIngredients();

    const [text, setText] = useState<string>('');

    const getIngredients = (text: string) => {
        fetchFoundIngredientsByText(text).then(() => {
            console.log("Found ingredients:", foundIngredients);
            router.push('/found-ingredients');
        })
    }

    return (
        <ThemedView style={{ flex: 1 }}>
            <View style={{ flex: 1, marginTop: 100 }}>
                <View style={{ width: '100%', marginBottom: 20, overflow: 'visible', }}>
                    <ThemedText
                        style={{
                            paddingTop: 20,
                            paddingLeft: 20,
                            paddingRight: 20,
                            paddingBottom: 20,
                            fontSize: 40,
                            fontWeight: 'bold',
                            lineHeight: 48,
                            overflow: 'visible',
                            textAlign: 'left'
                        }}>
                        Enter your ingredients
                    </ThemedText>
                    <TextInput
                        multiline
                        onChangeText={setText}
                        // numberOfLines={10}
                        scrollEnabled={true}
                        style={{
                            padding: 10,
                            margin: 20,
                            backgroundColor: colorScheme === 'light' ? '#f0f0f0' : '#333',
                            borderRadius: 8,
                            color: colorScheme === 'light' ? '#000' : '#fff',
                            textAlignVertical: 'top',
                            maxHeight: "60%",
                        }}
                        placeholder="Enter ingredients here, separated by commas"
                        placeholderTextColor={colorScheme === 'light' ? '#888' : '#aaa'}
                    />
                    <TouchableOpacity
                        style={{
                            left: '50%',
                            transform: [{ translateX: -90 }],
                        }}
                        onPress={() => { getIngredients(text) }}
                    >
                        <View
                            style={{
                                backgroundColor: '#2C2C2E',
                                width: 180,
                                height: 55,
                                borderRadius: 70,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}>
                            <MaterialCommunityIcons name="note-search" size={18} color="white" style={{ paddingBottom: 4 }}></MaterialCommunityIcons>
                            <ThemedText style={{ color: 'white', fontSize: 16, paddingLeft: 10, paddingBottom: 0 }}>Find ingredients</ThemedText>
                        </View>
                    </TouchableOpacity>

                </View>
            </View>
        </ThemedView>
    );
}
