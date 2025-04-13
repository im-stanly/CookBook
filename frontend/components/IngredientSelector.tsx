import { useState } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { Picker } from '@react-native-picker/picker';

const ingredient_not_selected_text = "select ingredient";

//TODO: Measurement units for ingredients
export function IngredientSelector({ possible_ingredients, add_ingredient }: { possible_ingredients: string[], add_ingredient: (ingredient: string) => void }) {
    const ing_list = [ingredient_not_selected_text].concat(possible_ingredients).map((i) => <option value={i}>{i}</option>);
    const [selected_ingredient, setSelectedIngredient] = useState<string>(ingredient_not_selected_text);
    return (
        <View style={styles.container}>
            <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selected_ingredient}
                        onValueChange={(itemValue) => setSelectedIngredient(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label={ingredient_not_selected_text} value={ingredient_not_selected_text} />
                        {possible_ingredients.map((ingredient, index) => (
                            <Picker.Item key={index} label={ingredient} value={ingredient} />
                        ))}
                    </Picker>
            </View>
                
            <Pressable
                style={styles.button}
                onPress={() => {
                    if (selected_ingredient !== ingredient_not_selected_text) {
                        add_ingredient(selected_ingredient);
                        setSelectedIngredient(ingredient_not_selected_text);
                    }
                }}
            >
                <Text style={styles.buttonText}>Add Ingredient</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 15,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10, 
        justifyContent: 'center',
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    button: {
        backgroundColor: 'green',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    }
});