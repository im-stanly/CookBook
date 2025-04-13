import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { IngredientSelector } from '@/components/IngredientSelector';
import { IngredientList } from '@/components/IngredientList';
import { router } from 'expo-router';

//TODO: Get the possible ingredients from the server
function getPossibleIngredients(): string[] {
	return ["banana", "potato"];
}

export default function Index() {
    const possibleIngredients = getPossibleIngredients();
    const [ingredients, setIngredients] = React.useState<string[]>([]);

    return (
        <View
            style={styles.container}>
            <IngredientList ingredients={ingredients} />
            <View style={styles.selectorContainer}>
                <IngredientSelector possible_ingredients={possibleIngredients} add_ingredient={(i) => {
                    if (ingredients.indexOf(i) === -1) {
                        const new_ings = ingredients.slice();   //Without this, the state is not updated
                        new_ings.push(i);
                        setIngredients(new_ings)
                    }
                }} />
            </View>
            <Pressable
                style={{
                    margin: 10,
                    backgroundColor: 'green',
                    padding: 10,
                    borderRadius: 10,
                }}
                onPress={() => {
                    router.push({
                        pathname: "/recipes",
                        params: { ingredients: JSON.stringify(ingredients) }
                    });
                }}
            >
                <Text style={{ color: 'white' }}>get recipe</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingVertical: 20,
    },
    selectorContainer: {
        width: '80%',
        marginVertical: 15,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    text: {
        color: 'white',
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
    },
});