import { View, Text, StyleSheet } from "react-native";

export function NoRecipeFoundView() {
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>No Recipe Found</Text>
            <Text style={styles.baseText}>You may consider buying more ingredients or starving.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    titleText: {
        fontSize: 20,
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