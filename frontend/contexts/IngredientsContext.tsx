import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "./AuthContext";
import { jwtDecode } from 'jwt-decode';

export type Ingredient = {
    id: string;
    name: string;
    quantity: number;
    unit: string;
};

interface IngredientListProps {
    ingredientsState?: { ingredientList: Ingredient[] }; // An object rather than just an array in case we need to store more state
    setIngredientsState?: (ingredientsState: { ingredientList: Ingredient[] }) => void;
}

const INGREDIENTS_STORAGE_KEY = 'ingredients_list';

const IngredientsContext = createContext<IngredientListProps>({
});

export const useIngredients = () => {
    return useContext(IngredientsContext);
};

export const IngredientsProvider = ({ children }: any) => {
    const { authState } = useAuth(); 
    const [ingredientsState, setIngredientsStateLocal] = useState<{
        ingredientList: Ingredient[]
    }>({
        ingredientList: []
    });

    const getUserStorageKey = () => {
        if (authState?.token) {
            const decoded: any = jwtDecode(authState.token);
            const userId = decoded.id;
            return `${INGREDIENTS_STORAGE_KEY}_${userId}`;
        }
        return `${INGREDIENTS_STORAGE_KEY}_guest`;
    };

    useEffect(() => {
        const loadIngredients = async () => {
            if (authState?.loading) return;

            const storageKey = getUserStorageKey();
            console.log("Attempting to load ingredients with key:", storageKey);

            try {
                const storedIngredients = await SecureStore.getItemAsync(storageKey);
                if (storedIngredients) {
                    const parsedIngredients = JSON.parse(storedIngredients);
                    setIngredientsStateLocal({
                        ingredientList: parsedIngredients
                    });
                    console.log("Loaded ingredients from storage with key:", storageKey);
                } else {
                    console.log("No stored ingredients found for key:", storageKey);
                    setIngredientsStateLocal({
                        ingredientList: []
                    });
                }
            } catch (error) {
                console.error("Error loading ingredients from storage:", error);
                setIngredientsStateLocal({
                    ingredientList: []
                });
            }
        };
        loadIngredients();
    }, [authState?.token, authState?.loading]);

    const setIngredientsState = async (newState: { ingredientList: Ingredient[] }) => {
        const storageKey = getUserStorageKey();
        console.log("Saving ingredients with key:", storageKey, "Data:", newState.ingredientList);

        try {
            await SecureStore.setItemAsync(storageKey, JSON.stringify(newState.ingredientList));
            setIngredientsStateLocal(newState);
        }
        catch (error) {
            console.error("Error saving ingredients to storage:", error);
        }
    };

    const value = {
        ingredientsState,
        setIngredientsState,
    };

    return <IngredientsContext.Provider value={value}>{children}</IngredientsContext.Provider>;
}