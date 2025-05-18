import { createContext, useContext, useEffect, useState } from "react";


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

const IngredientsContext = createContext<IngredientListProps>({
});

export const useIngredients = () => {
    return useContext(IngredientsContext);
};

export const IngredientsProvider = ({ children }: any) => {
    const [ingredientsState, setIngredientsState] = useState<{
        ingredientList: Ingredient[]
    }>({
        ingredientList: [
            // { id: "0", name: "Add Ingredients!", quantity: 0, unit: "" },
        ]
    });

    const value = {
        ingredientsState,
        setIngredientsState,
    };

    return <IngredientsContext.Provider value={value}>{children}</IngredientsContext.Provider>;
}