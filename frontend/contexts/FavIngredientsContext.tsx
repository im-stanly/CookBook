import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "./AuthContext";
import { jwtDecode } from 'jwt-decode';

export type FavIngredient = {
    id: string;
    name: string;
};

interface FavIngredientListProps {
    favIngredientsState?: { favIngredientList: FavIngredient[] };
    setFavIngredientsState?: (favIngredientsState: { favIngredientList: FavIngredient[] }) => void;
}

const FAV_INGREDIENTS_STORAGE_KEY = 'favIngredients_list';

const FavIngredientsContext = createContext<FavIngredientListProps>({
});

export const useFavIngredients = () => {
    return useContext(FavIngredientsContext);
};

export const FavIngredientsProvider = ({ children }: any) => {
    const { authState } = useAuth();
    const [favIngredientsState, setFavIngredientsStateLocal] = useState<{
        favIngredientList: FavIngredient[],
    }>({
        favIngredientList: [],
    });

    // generate storage key, we'll be using this to load and store favIngredients  
    const getUserStorageKey = () => {
        if (authState?.token) {
            // we need to decode the JWT token to get user ID
            // I dont think thats the best way to store data but it works 
            const decoded: any = jwtDecode(authState.token);
            const userId = decoded.id;
            return `${FAV_INGREDIENTS_STORAGE_KEY}_${userId}`;
        }
        return `${FAV_INGREDIENTS_STORAGE_KEY}_guest`;
    };

    // this one is new
    useEffect(() => {
        const loadFavIngredients = async () => {
            if (authState?.loading) return;

            const storageKey = getUserStorageKey();
            console.log("Load favIngredients with key:", storageKey);

            try {
                // get the favIngredients from secure storage
                const storedFavIngredients = await SecureStore.getItemAsync(storageKey);
                if (storedFavIngredients) {
                    const parsedFavIngredients = JSON.parse(storedFavIngredients);
                    setFavIngredientsStateLocal({
                        favIngredientList: parsedFavIngredients,
                    });
                    console.log("Loaded favIngredients with key:", storageKey);
                } else {
                    console.log("No favIngredients for key:", storageKey);
                    setFavIngredientsStateLocal({
                        favIngredientList: [],
                    });
                }
            } catch (error) {
                console.error("Error loading favIngredients:", error);
                setFavIngredientsStateLocal({
                    favIngredientList: [],
                });
            }
        };
        loadFavIngredients();
    }, [authState?.token, authState?.loading]);

    // wrapper for setFavIngredientsStateLocal so that any time favIngredients changes 
    // we overwrite prev saved favIngredients list
    const setFavIngredientsState = async (newState: { favIngredientList: FavIngredient[] }) => {
        const storageKey = getUserStorageKey();
        console.log("Saving favIngredients with key:", storageKey, "Data:", newState.favIngredientList);

        try {
            // save the favIngredients to the ss
            await SecureStore.setItemAsync(storageKey, JSON.stringify(newState.favIngredientList));
            setFavIngredientsStateLocal(newState);
        }
        catch (error) {
            console.error("Error saving favIngredients to storage:", error);
        }
    };

    const value = {
        favIngredientsState,
        setFavIngredientsState,
    };

    return <FavIngredientsContext.Provider value={value}>{children}</FavIngredientsContext.Provider>;
}