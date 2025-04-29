import React, {useState, useRef, useImperativeHandle, forwardRef} from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from "expo-router";


type Ingredient = {
    id: string;
    name: string;
    quantity: number;
    unit: string;
};

type IngredientListProps = {
    item: string;
    quantity: number;
    unit: string;
    onAddIngredient: (ingredient: Ingredient) => void;
    onQuantityChange: (quantity: number) => void;
    onRemoveIngredient: () => void;
};

{/* TODO: Make each item clickable so user can edit quantity of stuff (new modal ts) */} 
const IngredientListItem = ({
    item,
    quantity,
    unit,
    onAddIngredient,
    onQuantityChange,
    onRemoveIngredient,
}: IngredientListProps) => {
    const colorScheme = useColorScheme();

    return (
        <View style={[styles.container, {backgroundColor: colorScheme === 'light' ? '#222' : '#222'}]}>
            <ThemedText style={styles.itemText}>{item}</ThemedText>
            <View style={styles.controls}>
                <ThemedText style={styles.itemText}>{quantity}</ThemedText>
                <ThemedText style={styles.unitText}>{unit}</ThemedText>
            </View>
            <TouchableOpacity onPress={onRemoveIngredient} style={styles.removeBtn}>
                <MaterialIcons name="close" size={24} color="gray" />
            </TouchableOpacity>
        </View>
    )
};

const AddIngredientButton = ({ onPress }: { onPress: () => void }) => {
    const colorScheme = useColorScheme();
    return (
      <TouchableOpacity onPress={onPress} style={[styles.addButtonContainer, 
        {borderColor: "gray"}]}>
        <MaterialIcons name="add" size={24} color="gray"/>        
      </TouchableOpacity>
    );
};
  
export interface IngredientListRef {
    clearAll: () => void;
}

export const IngredientList = forwardRef<IngredientListRef>((props, ref) => {
    const colorScheme = useColorScheme();
    
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { id: "3", name: "Flour", quantity: 99999, unit: "cups" },
        { id: "2", name: "Banana", quantity: 1, unit: "liters" },
        { id: "1", name: "Milk", quantity: 3, unit: "barrels" },
    ]);

    useImperativeHandle(ref, () => ({
        clearAll: () => {
            setIngredients([]);
        },
    }));

    const handleRemoveIngredient = (id: string) => {
        setIngredients(ingredients.filter(item => item.id !== id));
    };

    const handleQuantityChange = (id: string, quantity: number) => {
        setIngredients(ingredients.map(item => item.id === id ? { ...item, quantity } : item));
    };

    const handleAddIngredient = (ingredient: Ingredient) => {
        const highestId = ingredients.reduce((max, item) => Math.max(max, parseInt(item.id)), 0);
        const newId = (highestId + 1).toString();
        setIngredients([{ id: newId, name: 'New Ingredient', quantity: 1, unit: 'units' }, ...ingredients]);
    };

    const renderItem = ({ item }: { item: Ingredient | 'add-button' }) => {
        if (item === 'add-button') {
            return <AddIngredientButton onPress={() => router.push('/add-action-modal')} />;
        } else {
            return (
                <IngredientListItem
                    item={item.name}
                    quantity={item.quantity}
                    unit={item.unit}
                    onAddIngredient={handleAddIngredient}
                    onQuantityChange={(quantity) => handleQuantityChange(item.id, quantity)}
                    onRemoveIngredient={() => handleRemoveIngredient(item.id)}
                />
            );
        }
    }

    const listData = ['add-button' as const, ...ingredients];;
    return (
        <View>
            <FlatList
                data={listData}
                keyExtractor={(item) => typeof item === 'string' ? 'add-button' : item.id}
                renderItem={renderItem}
                inverted={true}
                showsVerticalScrollIndicator={false}
            />
            {/* <AddIngredientButton onPress={() => handleAddIngredient({ id: '', name: '', quantity: 1, unit: '' })} /> */}
        </View>
    );
});

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        position: 'relative',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderWidth: 0,
        borderRadius: 18,
        marginTop: 10,
    },
    itemText: {
        fontSize: 18,
        marginRight: 10,
        flex: 1,
        color: '#fff',
    },
    controls: {
        width: '40%',
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end', 
    },
    removeBtn: {
        marginLeft: 10,
    },
    addButtonContainer: {
        borderWidth: 2,
        borderRadius: 18,
        borderStyle: 'solid',
        marginTop: 10,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    unitText: {
        fontSize: 16,
        marginLeft: 10,
        color: '#fff',
    },
  });