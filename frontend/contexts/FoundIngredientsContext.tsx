import { createContext, useContext, useState } from "react";
import axios from "axios";
import { API_URL } from "@/constants/URLs";

export type FoundIngredient = {
    input: string,
    unit: string,
    name: string,
}

interface FoundIngredientsProps {
    foundIngredients: FoundIngredient[];
    fetchFoundIngredientsByText: (text: string) => Promise<void>;
    setFoundIngredients: (FoundIngredients: FoundIngredient[]) => void;
}

const foundIngredientsContex = createContext<FoundIngredientsProps>({
    foundIngredients: [],
    fetchFoundIngredientsByText: async () => { },
    setFoundIngredients: () => { },
});

export const useFoundIngredients = () => useContext(foundIngredientsContex);

export const FoundIngredientsProvider = ({ children }: any) => {
    const [foundIngredients, setFoundIngredients] = useState<FoundIngredient[]>([]);

    const fetchFoundIngredientsByText = async (text: string) => {
        setFoundIngredients([]);
        try {

            console.log("Sending text to API:", text);
            axios.post(`${API_URL}/recipe/byText`, { "ingredients": text }, {
                headers: {
                    "Content-Type": "application/json",
                }
            }).then((response) => {
                console.log("Response from API:", response.data);

                const fetchedFoundIngredients: FoundIngredient[] = response.data.map((item: any) => ({
                    input: item.input,
                    unit: item.unit,
                    name: item.name
                }));
                setFoundIngredients(fetchedFoundIngredients);
            })
        } catch (e) {
            console.error("Failed to fetch FoundIngredients:", e);
            setFoundIngredients([]);
        }
    };

    const value = {
        foundIngredients,
        fetchFoundIngredientsByText,
        setFoundIngredients
    }

    return <foundIngredientsContex.Provider value={value}>{children}</foundIngredientsContex.Provider>;
}