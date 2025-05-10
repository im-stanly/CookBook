package com.cookBook.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.cookBook.dto.IngredientModelDTO;
import com.cookBook.dto.RecipeModelDTO;
import com.cookBook.dto.UserInputIngredientDTO;
import com.cookBook.entity.IngredientInRecipeModel;
import com.cookBook.entity.IngredientModel;
import com.cookBook.entity.ReactionModel;
import com.cookBook.entity.RecipeModel;
import com.cookBook.repository.RecipeRepository;

@Service
public class RecipeService {
    @Autowired
    private RecipeRepository recipeRepository;

    @Transactional(readOnly = true)
    public List<RecipeModelDTO> getAllRecipes() {
        return recipeRepository.findAll().stream()
                .map(this::mapToRecipeModelDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RecipeModelDTO> getRecipesByIngredients(List<UserInputIngredientDTO> userIngredients) {
        List<String> allowedIngredientNames = userIngredients.stream()
                .map(UserInputIngredientDTO::getName)
                .distinct()
                .toList();

        // TODO: consider the amount of ingredients and the measurement unit

        if (allowedIngredientNames.isEmpty())
            return List.of();

        List<RecipeModel> recipePage = recipeRepository
                .findRecipesByAllowedIngredients(allowedIngredientNames);

        return recipePage.stream()
                .map(this::mapToRecipeModelDTO)
                .collect(Collectors.toList());
    }

    private RecipeModelDTO mapToRecipeModelDTO(RecipeModel recipe) {
        int likes = 0;
        int dislikes = 0;

        if (recipe.getReactions() != null) {
            for (ReactionModel reaction : recipe.getReactions()) {
                if (reaction.isLike())
                    likes++;
                else
                    dislikes++;
            }
        }

        List<IngredientModelDTO> ingredientDTOs = recipe.getIngredients().stream()
                .map(this::mapToIngredientModelDTO)
                .collect(Collectors.toList());

        return RecipeModelDTO.builder()
                .name(recipe.getName())
                .description(recipe.getDescription())
                .likesCount(likes)
                .dislikesCount(dislikes)
                .ingredients(ingredientDTOs)
                .build();
    }

    private IngredientModelDTO mapToIngredientModelDTO(IngredientInRecipeModel ingredientInRecipe) {
        IngredientModel ingredient = ingredientInRecipe.getIngredient();
        return IngredientModelDTO.builder()
                .name(ingredient.getName())
                .unitName(ingredientInRecipe.getMeasurementUnit().getName())
                .amountRangeStart(ingredientInRecipe.getAmountRangeStart())
                .amountRangeEnd(ingredientInRecipe.getAmountRangeEnd())
                .preciseIngredientName(ingredient.getName())
                .approximateCaloriesPer100Gram(ingredient.getApproximateCaloriesPer100Gram())
                .build();
    }
}
