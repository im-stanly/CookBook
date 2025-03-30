import { Text, View, StyleSheet } from "react-native";

export function RecipeView(recipe: { name: string,description: string, ingredients: string[],  steps: string[] }) {
    const ingredients = (recipe.ingredients.map((i) => <li style={styles.baseText}>{i}</li>));
    const steps = (recipe.steps.map((s) => <li style={styles.baseText}>{s}</li>));
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>{recipe.name}</Text>
            <Text style={styles.baseText}>{recipe.description}</Text>
            <Text style={styles.headerText}>Ingredients:</Text>
            <ul>
                {ingredients}
            </ul>
            <Text style={styles.headerText}>Steps:</Text>
            <ol>
                {steps}
            </ol>
        </View>
    );
};

const styles = StyleSheet.create({
    titleText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    headerText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    baseText: {
        fontSize: 16,
    },
    container: {
        flex: 1,
        justifyContent: "center",
    },
});