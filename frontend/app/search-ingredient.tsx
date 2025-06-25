import { Sizes } from "@/constants/Add-button-sizes";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { useRef, useEffect, useState } from "react";
import { Animated, DimensionValue, Pressable, TouchableOpacity, View, StyleSheet, TextInput, Text, FlatList, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useIngredients } from "@/contexts/IngredientsContext";
import { API_URL } from "@/constants/URLs";
import axios from "axios";

const BTN_SIZE = Sizes.BTN_SIZE;
const BTN_BOTTOM_OFFSET = Sizes.ADDBTN_BOTTOM_OFFSET as DimensionValue;
const BTN_RIGHT_OFFSET = Sizes.ADDBTN_RIGHT_OFFSET as DimensionValue;

//TODO: REFACTOR THIS FILE. IT'S A MESS.

export default function SearchIngredient() {
    const animation = useRef(new Animated.Value(0)).current;

    const placeholder = "Search for ingredients";
    // const [validIngredient, setValidIngredient] = useState<true | false | "empty">("empty");
    // const [ingredient, setIngredient] = useState<string>("");
    const [unitsList, setUnitsList] = useState<string[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<string>("");
    const [ingredientAmount, setIngredientAmount] = useState<number>(0);
    const [ingredientAmountInput, setIngredientAmountInput] = useState<string>("0");
    const { ingredientsState, setIngredientsState } = useIngredients();

    const [possibleIngredients, setPossibleIngredients] = useState<string[]>([]);
    const [unitsForIngredients, setUnitsForIngredients] = useState<Map<string, string[]>>(new Map<string, string[]>());

    const [ingredientSuggestions, setIngredientSuggestions] = useState<string[]>([]);
    const [isIngredientSuggestionsLoading, setIsIngredientSuggestionsLoading] = useState(false);

    const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
    const [inputedIngredient, setInputedIngredient] = useState<string>("");

    const [isDropdownListDropDown, setIsDropdownListDropDown] = useState(false);


    const getIngredientSuggestions = (text: string) => {
        // text = text.toLowerCase();
        setIsIngredientSuggestionsLoading(true);
        axios.get(`${API_URL}/recipe/ingredients/${text}`, {}).then((response) => {
            setIngredientSuggestions(Object.keys(response.data));
            console.log("Ingredient suggestions:", Object.keys(response.data));
            setIsIngredientSuggestionsLoading(false);
        })
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

    const selectIngredient = (item: string | null) => {
        if (item) {
            axios.get(`${API_URL}/recipe/ingredients/${item}`, {}).then((response) => {
                if (Object.keys(response.data).find((i) => i === item) !== undefined) {
                    setUnitsList(Object.entries(response.data).filter((i) => i[0] === item).map((i) => i[1])[0] as string[]);
                    setSelectedIngredient(item);
                    console.log("Neue Einheitsliste:", Object.entries(response.data).filter((i) => i[0] === item).map((i) => i[1])[0] as string[]);
                }
                else {
                    setUnitsList([]);
                    setSelectedIngredient(null);
                }
            })
        } else {
            setUnitsList([]);
            setSelectedIngredient(null);
        }
    }

    useEffect(() => {
        Animated.spring(animation, {
            toValue: 1,
            friction: 6,
            useNativeDriver: true,
        }).start();
    }, [animation]);

    const handleClose = () => {
        Animated.timing(animation, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
        }).start(() => {
            if (router.canGoBack()) {
                router.back();
            }
        });
    };

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
        }
        handleClose();
    }

    return (
        <View style={styles.container}>
            {/*Window closing on every missclick is IRRITATING. Uncomment, if you think otherwise.*/}
            <Pressable style={StyleSheet.absoluteFill} onPress={/*handleClose*/() => { }}>
                <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
            </Pressable>

            <View style={styles.searchContainer}>
                <Text style={styles.headerText}>Add Ingredient</Text>

                {/* Do not attempt to replace this homebrew solution with react-native-autocomplete-dropdown, unless thou wishest to lose thy sanity and three hours of thy life on debugging this vile creation.*/}
                <View style={styles.droppyDoppyListyContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#383b42', borderRadius: 25, padding: 10, minHeight: 50 }}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => {
                                getIngredientSuggestions(text);
                                selectIngredient(text);
                                setInputedIngredient(text);
                            }}
                            value={inputedIngredient}
                        />

                        {isDropdownListDropDown ?
                            <MaterialIcons
                                name="arrow-drop-up"
                                size={28}
                                color="white"
                                onPress={() => setIsDropdownListDropDown(false)}
                                style={styles.addButton}
                            /> :
                            <MaterialIcons
                                name="arrow-drop-down"
                                size={28}
                                color="white"
                                style={styles.addButton}
                                onPress={() => setIsDropdownListDropDown(true)}
                            />
                        }
                    </View>

                    {isDropdownListDropDown && ingredientSuggestions.length > 0 &&
                        <ScrollView style={{ maxHeight: 200, backgroundColor: '#383b42', borderRadius: 25, padding: 10, minHeight: 50 }}>
                            {ingredientSuggestions.map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    onPress={() => {
                                        selectIngredient(item);
                                        setInputedIngredient(item);
                                        setIsDropdownListDropDown(false);
                                        getIngredientSuggestions(item);
                                    }}
                                    style={styles.ingredientSuggestionItem}
                                >
                                    <Text style={{ color: '#fff' }}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    }

                </View>

                <View style={styles.unitSelectionContainer} >
                    <TextInput style={styles.input}
                        onChangeText={onIngredientAmountInput}
                        onBlur={onIngredientAmountBlur}
                        value={ingredientAmountInput}
                        placeholder={placeholder}
                        keyboardType="numeric"
                    />

                    {unitsList.length > 0 ?
                        <Picker
                            selectedValue={selectedUnit}
                            onValueChange={(itemValue) => setSelectedUnit(itemValue)}
                            mode="dropdown"
                            style={styles.picker}
                        >
                            {unitsList.map((unit, index) => (
                                <Picker.Item key={index} label={unit} value={unit} style={styles.pickerItem} />
                            )
                            )}
                        </Picker>
                        : <Picker enabled={false} style={styles.picker} />
                    }
                </View>
                {checkAdd() ?
                    <MaterialIcons
                        name="add"
                        size={28}
                        color="white"
                        onPress={handleAddIngredient}
                        style={styles.addButton}
                    /> :
                    <MaterialIcons
                        name="add"
                        size={28}
                        color="gray"
                        style={styles.addButton}
                    />
                }
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleClose} style={styles.mainButton}>
                    <Animated.View style={{
                        transform: [{
                            rotate: animation.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '45deg'],
                            })
                        }]
                    }}>
                        <MaterialIcons name="add" size={28} color="white" />
                    </Animated.View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: BTN_BOTTOM_OFFSET,
        right: BTN_RIGHT_OFFSET,
        alignItems: 'center',
    },
    searchContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        zIndex: 1,
    },
    droppyDoppyListyContainer: {
        backgroundColor: '#383b42',
        borderRadius: 25,
        padding: 10,
        minHeight: 50,
        zIndex: 1,
        flexDirection: 'column',
    },
    unitSelectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    mainButton: {
        width: BTN_SIZE,
        height: BTN_SIZE,
        borderRadius: BTN_SIZE / 2,
        backgroundColor: '#2C2C2E', // Dark color
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    wrongText: {
        color: 'red',
        fontSize: 16,
        marginTop: 5,
        width: 150,
    },
    picker: {
        height: 50,
        width: 150,
        margin: 12,
    },
    pickerItem: {
        height: 50,
        width: 150,
    },
    addButton: {
        backgroundColor: '#2C2C2E',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    ingredientSuggestionItem: {
        backgroundColor: '#383b42',
        padding: 15,
        minHeight: 20,
    },
});