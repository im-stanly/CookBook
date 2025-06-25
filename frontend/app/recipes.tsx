import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"
import { ScrollView, TouchableOpacity, View } from "react-native"
import { useEffect, useState } from "react";
import { useRecipes } from "@/contexts/RecipesContext"; 
import { Dimensions } from "react-native"
import { Recipe } from "@/contexts/RecipesContext"; 
import RecipeCard from "@/components/RecipeCard";
import ReanimatedCarousel from 'react-native-reanimated-carousel';
import { Sizes } from "@/constants/Add-button-sizes";
import { isLoaded } from "expo-font";

const { width: screenWidth } = Dimensions.get("window");
const { height: screenHeight } = Dimensions.get("window");

const TABBAR_HEIGHT = Sizes.TABBAR_HEIGHT;

const LoadMoreButton = ({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity
        activeOpacity={0.9}
        style={{
            width: screenWidth * 0.85, 
            height: screenHeight * 0.60, 
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            padding: 20,
            marginVertical: 10,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            paddingTop: 24,
            backgroundColor: '#222',
            }}
            onPress={onPress}
        >  
        <ThemedText style={{ color: 'white', fontWeight: 'bold' ,fontSize: 16, paddingBottom: 0 }}>Load More</ThemedText>
  </TouchableOpacity>
);

export default function RecipesScreen() {
    const { recipes, fetchRecipes, setRecipes } = useRecipes();
    const [ loadedRecipes, setLoadedRecipes ] = useState(0);
    const [ isLoadMoreButtonVisible, setIsLoadMoreButtonVisible ] = useState(true);
    const [ recipeList, setRecipeList ] = useState<[number, Recipe][]>([]);

    const handleLoadMore = () => {
        if (loadedRecipes < recipeList.length) {
            setLoadedRecipes(loadedRecipes + 5 > recipeList.length ? recipeList.length : loadedRecipes + 5);
        }

        if (loadedRecipes >= recipeList.length) {
            setIsLoadMoreButtonVisible(false);
        }

    };

    useEffect(() => {
        const fetchData = async () => {
            setRecipes(new Map());
            await fetchRecipes();
        };
        fetchData();
    }, []); 

    useEffect(() => {
        const recipePairs: [number, Recipe][] = [];
        recipes.forEach((recipeArray, key) => {
            recipeArray.forEach(recipe => {
                recipePairs.push([key, recipe]);
            });
        });

        recipePairs.sort((a, b) => {
            const aRecipe = a[1];
            const bRecipe = b[1];
            const likesA = aRecipe.likesCount ? Number(aRecipe.likesCount) : 0;
            const likesB = bRecipe.likesCount ? Number(bRecipe.likesCount) : 0;
            
            const dislikesA = aRecipe.dislikesCount ? Number(aRecipe.dislikesCount) : 0;
            const dislikesB = bRecipe.dislikesCount ? Number(bRecipe.dislikesCount) : 0;

            const ratingA = likesA - dislikesA;
            const ratingB = likesB - dislikesB;

            return ratingB - ratingA;
        });

        recipePairs.sort((a, b) => {
            const aMatch = a[0];
            const bMatch = b[0];
            return bMatch - aMatch; 
        });

        setRecipeList(recipePairs);
    }, [recipes]);

    useEffect(() => {
        if (recipeList.length <= 5) {
            setLoadedRecipes(recipeList.length);
            setIsLoadMoreButtonVisible(false);
        } else {
            setLoadedRecipes(5);
            setIsLoadMoreButtonVisible(true);
        }
    }, [recipeList]);

    const limitedRecipes = recipeList.slice(0, loadedRecipes);
    
    const carouselItems = isLoadMoreButtonVisible && loadedRecipes < recipeList.length
        ? [...limitedRecipes, { id: 'load-more', isLoadMoreButton: true }]
        : limitedRecipes;

    return (
        <ThemedView style={{ flex: 1, padding: 100, justifyContent: "center", alignItems: 'center', overflow: 'visible' }}>
            {limitedRecipes.length === 0 ? (
                <ThemedText>No recipes found.</ThemedText>
            ) : (
                <ReanimatedCarousel
                    width={screenWidth}
                    height={screenHeight * 0.60}
                    data={carouselItems}
                    renderItem={({ item }: { item: any }) => 
                        item.isLoadMoreButton ? 
                            <LoadMoreButton onPress={handleLoadMore} />
                            : 
                            <RecipeCard recipePair={[item[0], item[1]]} />
                    }
                    style={{
                        alignSelf: 'center',
                        marginLeft: 15,
                    }}
                    loop={false}
                    mode="parallax"
                    modeConfig={{
                        parallaxScrollingScale: 0.9,
                        parallaxScrollingOffset: 100, 
                    }}
                    defaultIndex={0}
                    snapEnabled={true}
                    windowSize={3}
                    scrollAnimationDuration={800}
                />
            )}
        </ThemedView>
    )
}
