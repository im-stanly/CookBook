import { Children, createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from '@/contexts/AuthContext';
import { Ingredient, useIngredients } from "@/contexts/IngredientsContext";
import { API_URL } from "@/constants/URLs";

export type RecipeIngredient = {
    name: string,
    unitName: string,
    amountRangeStart: string,
    amountRangeEnd: string,
    preciseIngredientName: string,
    approximateCaloriesPer100Gram: string
}

export type Recipe = {
    name: string,
    description: string,
    likesCount: string,
    dislikesCount: string,
    ingredients: RecipeIngredient[],
}

interface RecipesProps {
    // recipesState?: { recipes: Recipe[] };
    fetchRecipes?: () => Promise<Recipe[]>;
}

const RecipesContex = createContext<RecipesProps>({});

export const useRecipes = () => {
    return useContext(RecipesContex);
};

export const RecipesProvider = ({ children } : any) => {
    const [recipesState, setRecipesState] = useState<{recipes: Recipe[]}>({recipes: []});
    const { ingredientList } = useIngredients().ingredientsState!;

    const fetchRecipes = async () => {
        try {
            const payload = ingredientList.map(({ id, name, quantity, unit}) => ({
                name,
                unit,
                amount: quantity,
            }));

            const response = await axios.post(
                `${API_URL}/recipe/byIngredients`,
                payload
            );
            
            const fetchedRecipes: Recipe[] = response.data.map((item: any) => ({
                name: item.name,
                description: item.description,
                likesCount: String(item.likesCount),
                dislikesCount: String(item.dislikesCount),
                ingredients: item.ingredients.map((ing: any) => ({
                    name: ing.name,
                    unitName: ing.unitName,
                    amountRangeStart: String(ing.amountRangeStart),
                    amountRangeEnd: String(ing.amountRangeEnd),
                    preciseIngredientName: ing.preciseIngredientName,
                    approximateCaloriesPer100Gram: String(ing.approximateCaloriesPer100Gram),
                })),
            }));

            // setRecipesState({ recipes: fetchedRecipes });
            console.log("Fetched recipes:", response.data);
            return fetchedRecipes;
        } catch (e) {
            console.error("Failed to fetch recipes:", e);
            return [];
        }
    }

    const value = {
        // recipesState,
        fetchRecipes,
    }

    return <RecipesContex.Provider value={value}>{children}</RecipesContex.Provider>;
}