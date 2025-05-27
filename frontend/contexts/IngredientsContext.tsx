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
            { id: "1", name: "absinthe", quantity: 1, unit: "grams" },
            { id: "2", name: "dry vermouth", quantity: 32, unit: "ml" },
            { id: "3", name: "coconut water", quantity: 1, unit: "liter" },
            { id: "4", name: "cacao", quantity: 30, unit: "grams" },
            { id: "5", name: "gin", quantity: 15, unit: "ml" },
        ]
    });

    const value = {
        ingredientsState,
        setIngredientsState,
    };

    return <IngredientsContext.Provider value={value}>{children}</IngredientsContext.Provider>;
}