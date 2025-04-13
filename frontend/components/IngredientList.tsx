import { Text, View, FlatList, StyleSheet } from "react-native";

export function IngredientList({ingredients}: {ingredients: string[]}) {
    return (
        <View>
            <Text>Your ingredients:</Text>
            <FlatList
                data={ingredients}
                renderItem={({item}) => <Text style={styles.item}>• {item}</Text>}
                keyExtractor={(item, index) => index.toString()}
                style={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        padding: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    list: {
        marginLeft: 10,
    },
    item: {
        fontSize: 14,
        marginVertical: 2,
    }
});