import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";

const ingredient_not_selected_text = "select ingredient";

//TODO: Measurement units for ingredients
export function IngredientSelector({ possible_ingredients, add_ingredient }: { possible_ingredients: string[], add_ingredient: (ingredient: string) => void }) {
    const ing_list = [ingredient_not_selected_text].concat(possible_ingredients).map((i) => <option value={i}>{i}</option>);
    const [selected_ingredient, setSelectedIngredient] = useState<string>(ingredient_not_selected_text);
    return (<View>
        <select value={selected_ingredient} onChange={(e) => setSelectedIngredient(e.target.value)}>
            {ing_list}
        </select>
        <button onClick={() => {
            if (selected_ingredient !== ingredient_not_selected_text) {
                add_ingredient(selected_ingredient);
                setSelectedIngredient(ingredient_not_selected_text);
            }
        }}>Add Ingredient</button>
    </View>);
};