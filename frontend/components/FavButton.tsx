import { FavIngredient, useFavIngredients } from "@/contexts/FavIngredientsContext";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";


export default function FavButton({
    item
}: {
    item: string
}) {
    const { favIngredientsState, setFavIngredientsState } = useFavIngredients();

    const isInFavIngredientsList = favIngredientsState?.favIngredientList.some(
        (ingredient: any) => ingredient.name.toLowerCase() === item.toLowerCase()
    ) || false

    return (<TouchableOpacity
        onPress={() => {
            if (isInFavIngredientsList) {
                const newFavIngredients = favIngredientsState!.favIngredientList.filter(
                    (ingredient: FavIngredient) => ingredient.name.toLowerCase() !== item.toLowerCase()
                );
                setFavIngredientsState!({ favIngredientList: newFavIngredients, });
            } else {
                const newFavIngredient: FavIngredient = {
                    id: Math.random().toString(36).substring(2, 15), // Generate a random ID
                    name: item
                };
                setFavIngredientsState!({
                    favIngredientList: [...favIngredientsState!.favIngredientList, newFavIngredient]
                });
            }
        }}
        style={{ alignSelf: 'stretch', justifyContent: 'center' }}>
        <MaterialIcons
            name={isInFavIngredientsList ? "star" : "star-outline"}
            size={24}
            color={isInFavIngredientsList ? "#FFD700" : "gray"}
            style={{ paddingRight: 15 }}
        />
    </TouchableOpacity>);
}