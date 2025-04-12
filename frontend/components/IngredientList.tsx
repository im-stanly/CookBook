import { Text, View, StyleSheet } from "react-native";

export function IngredientList({ingredients}: {ingredients: string[]}) {
    const ing_list = ingredients.map((i) => <li>{i}</li>);
    return (
        <View>
            <Text>Your ingredients:</Text>
            <ul>
                {ing_list}
            </ul>
        </View>
    );
};