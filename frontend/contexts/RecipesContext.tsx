import { createContext, useContext, useState } from "react";
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
    recipes: Recipe[];
    fetchRecipes: () => Promise<void>;
    setRecipes: (recipes: Recipe[]) => void;
}

const RecipesContex = createContext<RecipesProps>({
    recipes: [],
    fetchRecipes: async () => {},
    setRecipes: () => {},
});

export const useRecipes = () => useContext(RecipesContex);

export const RecipesProvider = ({ children } : any) => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const { ingredientList } = useIngredients().ingredientsState!;

    const fetchRecipes = async () => {
        setRecipes([]);
        // console.log("Ingredient list:", ingredientList);
         try {
            const payload = ingredientList.map(({ id, name, quantity, unit}) => ({
                name: name,
                unit: unit, 
                amount: quantity
            }));
            // console.log("Sending payload:", payload);

            const response = await axios({
                method: 'post',
                url: `${API_URL}/recipe/byIngredients`,
                data: payload,
                headers: {
                    "Content-Type": "application/json",
                } 
            });

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
            setRecipes(fetchedRecipes); 
            console.log("Fetched recipes!");
        } catch (e) {
            console.error("Failed to fetch recipes:", e);
            setRecipes([]);
        }
    };

    const value = {
        recipes,
        fetchRecipes,
        setRecipes
    }

    return <RecipesContex.Provider value={value}>{children}</RecipesContex.Provider>;
}