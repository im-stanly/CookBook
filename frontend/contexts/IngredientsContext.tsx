import { createContext, useContext, useEffect, useState } from "react";
import { storage } from "@/utils/storage";
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

    // generate storage key, we'll be using this to load and store ingredients  
    const getUserStorageKey = () => {
        if (authState?.token) {
            // we need to decode the JWT token to get user ID
            // I dont think thats the best way to store data but it works 
            const decoded: any = jwtDecode(authState.token);
            const userId = decoded.id;
            return `${INGREDIENTS_STORAGE_KEY}_${userId}`;
        }
        return `${INGREDIENTS_STORAGE_KEY}_guest`;
    };

    // this one is new
    useEffect(() => {
        const loadIngredients = async () => {
            if (authState?.loading) return;

            const storageKey = getUserStorageKey();
            console.log("Load ingredients with key:", storageKey);

            try {
                // get the ingredients from secure storage
                const storedIngredients = await storage.getItemAsync(storageKey);
                if (storedIngredients) {
                    const parsedIngredients = JSON.parse(storedIngredients);
                    setIngredientsStateLocal({
                        ingredientList: parsedIngredients
                    });
                    console.log("Loaded ingredients with key:", storageKey);
                } else {
                    console.log("No ingredients for key:", storageKey);
                    setIngredientsStateLocal({
                        ingredientList: []
                    });
                }
            } catch (error) {
                console.error("Error loading ingredients:", error);
                setIngredientsStateLocal({
                    ingredientList: []
                });
            }
        };
        loadIngredients();
    }, [authState?.token, authState?.loading]);

    // wrapper for setIngredientsStateLocal so that any time ingredients changes 
    // we overwrite prev saved ingredients list
    const setIngredientsState = async (newState: { ingredientList: Ingredient[] }) => {
        const storageKey = getUserStorageKey();
        console.log("Saving ingredients with key:", storageKey, "Data:", newState.ingredientList);

        try {
            // save the ingredients to the ss
            await storage.setItemAsync(storageKey, JSON.stringify(newState.ingredientList));
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