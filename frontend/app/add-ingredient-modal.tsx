import { router, useLocalSearchParams } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Animated, Pressable, Text, useColorScheme, TextInput, ActivityIndicator } from 'react-native';
import { BlurView } from "expo-blur";
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Picker } from '@react-native-picker/picker';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useIngredients } from '@/contexts/IngredientsContext';
import { Ingredient } from '@/contexts/IngredientsContext';
import axios from 'axios';
import { API_URL } from '@/constants/URLs';

//TODO: IT'S STILL A MESS. REFACTOR THIS

export default function AddIngredientModal() {
    const colorScheme = useColorScheme();
    const params = useLocalSearchParams<{ ingredientName: string }>();
    
    const scaleAnimation = useRef(new Animated.Value(0.8)).current;
    const fadeAnimation = useRef(new Animated.Value(0)).current;

    const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);

    const [unitsList, setUnitsList] = useState<string[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<string>("");
    const [ingredientAmount, setIngredientAmount] = useState<number>(0);
    const [ingredientAmountInput, setIngredientAmountInput] = useState<string>("");
    const { ingredientsState, setIngredientsState } = useIngredients();

    useEffect(() => {
        selectIngredient(params.ingredientName || null);

        Animated.parallel([
            Animated.spring(scaleAnimation, {
                toValue: 1,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
            }),
            Animated.timing(fadeAnimation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, [params.ingredientName]);

    useEffect(() => {
        if (unitsList.length > 0) {
            setSelectedUnit(unitsList[0]);
        }

        const alreadyAddedIgredient = ingredientsState?.ingredientList.find((ingredient) => ingredient.name === selectedIngredient);

        if (alreadyAddedIgredient) {
            setSelectedUnit(alreadyAddedIgredient.unit);
            setIngredientAmount(alreadyAddedIgredient.quantity);
            setIngredientAmountInput(alreadyAddedIgredient.quantity.toString());
        }
    }, [unitsList]);

    const handleClose = () => {
        if (Keyboard.isVisible()) {
            Keyboard.dismiss();
            return;
        }

        Animated.parallel([
            Animated.timing(scaleAnimation, {
                toValue: 0.8,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnimation, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (router.canGoBack()) {
                router.back();
            }
        });
    };

    const selectIngredient = (item: string | null) => {
        if (item) {
            axios.get(`${API_URL}/recipe/ingredients/${item}`, {}).then((response) => {
                let units = [];
                if (Object.keys(response.data).find((i) => i === item) !== undefined) {
                    units = Object.entries(response.data).filter((i) => i[0] === item).map((i) => i[1])[0] as string[];
                    
                    if (!units || units.length === 0) {
                        units = ['piece'];
                    }
                    setUnitsList(units);
                    setSelectedIngredient(item);
                    console.log("Neue Einheitsliste (Nuovo Elenco):", Object.entries(response.data).filter((i) => i[0] === item).map((i) => i[1])[0] as string[]);
                }
            });
        } else {
            setUnitsList([]);
            setSelectedIngredient(null);
        }
    }

    const onIngredientAmountInput = (text: string) => {
        setIngredientAmountInput(text);
    }

    const onIngredientAmountBlur = () => {
        const amount = parseFloat(ingredientAmountInput);
        if (!isNaN(amount) && amount > 0) {
            setIngredientAmount(amount);
            setIngredientAmountInput(amount.toString());
        } else {
            setIngredientAmount(0);
            setIngredientAmountInput("0");
        }
    }

    const checkAdd = () => {
        if (selectedIngredient !== null
            && selectedUnit !== ""
            && !ingredientsState!.ingredientList.some((item) => item.name === selectedIngredient)
            && ingredientAmount > 0) {
            return true;
        }
        return false;

    }

    const handleAddIngredient = () => {
        if (checkAdd()) {
            const newIngredient = {
                id: (ingredientsState!.ingredientList.map(item => parseInt(item.id)).reduce((max, item) => Math.max(max, item), 0) + 1).toString(),
                name: selectedIngredient!,
                quantity: ingredientAmount,
                unit: selectedUnit,
            };
            setIngredientsState!({ ingredientList: [newIngredient, ...ingredientsState!.ingredientList] });
            console.log("Added ingredient:", selectedIngredient, ingredientAmount, selectedUnit);
        } else if (ingredientsState!.ingredientList.some((item) => item.name === selectedIngredient)) {
            const existingIngredient = ingredientsState!.ingredientList.find((item) => item.name === selectedIngredient);
            if (existingIngredient) {
                existingIngredient.quantity = ingredientAmount;
                existingIngredient.unit = selectedUnit;
                setIngredientsState!({ ingredientList: [...ingredientsState!.ingredientList] });
                console.log("Updated existing ingredient:", existingIngredient.name, existingIngredient.quantity, existingIngredient.unit);
            }
        }
        handleClose();
    }

    const handleDeleteIngredient = () => {
        if (selectedIngredient && ingredientsState?.ingredientList) {
            const updatedIngredients = ingredientsState.ingredientList.filter(item => item.name !== selectedIngredient);
            setIngredientsState!({ ingredientList: updatedIngredients });
            console.log("Deleted ingredient:", selectedIngredient);
            handleClose();
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <Pressable style={StyleSheet.absoluteFill} onPress={handleClose}>
                    <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnimation }]}>
                        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
                    </Animated.View>
                </Pressable>

                <Animated.View 
                    style={[
                        styles.modalContent,
                        {
                            backgroundColor: colorScheme === 'light' ? '#fff' : '#151718',
                            transform: [{ scale: scaleAnimation }],
                            opacity: fadeAnimation,
                        }
                    ]}
                >
                    <View style={styles.header}>
                        <ThemedText style={styles.headerTitle}>{params.ingredientName}</ThemedText>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <MaterialIcons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        {unitsList.length > 0 ? (
                            <>
                                <TextInput 
                                    style={[styles.input, { color: colorScheme === 'light' ? '#000' : '#fff' }]}
                                    onChangeText={onIngredientAmountInput}
                                    onBlur={onIngredientAmountBlur}
                                    value={ingredientAmountInput}
                                    placeholder={'0'}
                                    maxLength={3}
                                    keyboardType="numeric"
                                />
                                <Picker
                                    selectedValue={selectedUnit}
                                    onValueChange={(itemValue) => setSelectedUnit(itemValue)}
                                    mode="dropdown"
                                    style={[styles.picker, { color: colorScheme === 'light' ? '#000' : '#fff' }]}
                                >
                                    {unitsList.map((unit, index) => (
                                        <Picker.Item key={index} label={unit} value={unit} style={styles.pickerItem} />
                                    ))}
                                </Picker>
                            </>
                        ) : (
                            <ActivityIndicator 
                                size="large" 
                                color="#666" 
                            />
                        )}
                    </View>

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={[styles.optionButton, { width: '77%' }]} onPress={handleAddIngredient}>
                            <MaterialIcons name="check" size={24} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.optionButton, { width: '20%' }]} onPress={handleDeleteIngredient}>
                            <MaterialIcons name="delete" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 15,
        width: '90%',
        maxWidth: 400,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
        borderRadius: 15,
        backgroundColor: '#222',
    },
    content: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
    },
    input: {
        // height: 40,
        // margin: 12,
        // padding: 10,
        alignItems: 'center',
        textAlign: 'center', 
        fontSize: 34,
        width: '25%',
    },
    picker: {
        // height: 50,
        width: '50%',
    },
    pickerItem: {
        height: 50,
        width: 150,
    },
    buttonsContainer: {
        padding: 20,
        paddingTop: 10,
        flexDirection: 'row',
        gap: '3%',
    },
    optionButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#222',
        borderRadius: 12,
        borderColor: '#e0e0e0',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 15,
        fontWeight: '500',
    },
});