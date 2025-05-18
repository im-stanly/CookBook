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
        onPress={onPress}>
        
        {/* <View
        style={{
            backgroundColor: '#2C2C2E',
            width: 150,
            height: 55,
            borderRadius: 70,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
        }}> */}
            <ThemedText style={{ color: 'white', fontWeight: 'bold' ,fontSize: 16, paddingBottom: 0 }}>Load More</ThemedText>
        {/* </View> */}
  </TouchableOpacity>
);

export default function RecipesScreen() {
    const { recipes, fetchRecipes } = useRecipes();
    const [randomNumber, setRandomNumber] = useState(0);
    const [ loadedRecipes, setLoadedRecipes ] = useState(5);

    const handleLoadMore = () => {
        if (randomNumber + loadedRecipes < recipes.length) {
            setLoadedRecipes(loadedRecipes + 5);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchRecipes();
        };
        setRandomNumber(recipes.length > 5 ? Math.floor(Math.random() * (recipes.length - 5 + 1)) : 0);
        fetchData();
    }, []); 

    //limit to 5 recipes
    const limitedRecipes = recipes.slice(randomNumber, randomNumber + loadedRecipes);
    
    const carouselItems = [...limitedRecipes, { id: 'load-more', isLoadMoreButton: true }];

    return (
        <ThemedView style={{ flex: 1, padding: 20, justifyContent: "center", overflow: 'visible' }}>
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
                            <RecipeCard recipe={item} />
                    }
                    style={{
                        alignSelf: 'center',
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
