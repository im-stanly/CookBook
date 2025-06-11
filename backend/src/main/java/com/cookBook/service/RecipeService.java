package com.cookBook.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.cookBook.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.cookBook.dto.IngredientModelDTO;
import com.cookBook.dto.RecipeModelDTO;
import com.cookBook.dto.UserInputIngredientDTO;
import com.cookBook.repository.RecipeRepository;

@Service
public class RecipeService {
    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private IngredientService ingredientService;

    @Transactional(readOnly = true)
    public Map<Integer, List<RecipeModelDTO>> getRecipesByIngredients(List<UserInputIngredientDTO> userIngredients,String username) {
        List<String> allowedIngredientNames = userIngredients.stream()
                .map(UserInputIngredientDTO::getName)
                .distinct()
                .toList();

        if (allowedIngredientNames.isEmpty())
            return Map.of();

        int howManyMissmatch = allowedIngredientNames.size() / 2;
        List<RecipeModel> recipes = recipeRepository.findRecipesByAllowedIngredients(allowedIngredientNames, howManyMissmatch);

        Map<Integer, List<RecipeModelDTO>> resultMap = new java.util.HashMap<>();

        for (RecipeModel recipe : recipes) {
            int total = recipe.getIngredients().size();
            if (total == 0) continue;

            int matched = 0;
            for (IngredientInRecipeModel iir : recipe.getIngredients()) {
                if (allowedIngredientNames.contains(iir.getIngredient().getName())) {
                    matched++;
                }
            }

            int percentage = (int) (100.0 * matched / total);
            if (percentage >= 50) {
                resultMap.computeIfAbsent(percentage, k -> new java.util.ArrayList<>())
                         .add(mapToRecipeModelDTO(recipe,username));
            }
        }

        return resultMap;
    }

    public List<Map<String, String>> plainTextToIngredients(String plainText) {
        List<Map<String, String>> result = new ArrayList<>();
        if (plainText == null || plainText.isBlank()) {
            return result;
        }

        for (String raw : plainText.split(",")) {
            String input = raw.trim();
            if (input.isEmpty()) continue;

            String[] tokens = input.split("\\s+");
            String unitToken = "";
            String nameToken = input;
            if (tokens.length > 1) {
                unitToken = tokens[tokens.length - 1];
                nameToken = String.join(" ", java.util.Arrays.copyOfRange(tokens, 0, tokens.length - 1));
            }

            Map<String, List<String>> dbMatches = ingredientService.getAllIngredientsWithConversions(nameToken);
            for (var entry : dbMatches.entrySet()) {
                String dbName = entry.getKey();
                for (String dbUnit : entry.getValue()) {

                    if (unitToken.isEmpty() || dbUnit.equalsIgnoreCase(unitToken)) {
                        Map<String, String> map = new HashMap<>();
                        map.put("input", input);
                        map.put("name", dbName);
                        map.put("unit", dbUnit);
                        result.add(map);
                    }
                }
            }
        }

        return result;
    }

    private RecipeModelDTO mapToRecipeModelDTO(RecipeModel recipe, String username) {
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

        var resultBuilder = RecipeModelDTO.builder()
                .id(recipe.getId())
                .name(recipe.getName())
                .description(recipe.getDescription())
                .likesCount(likes)
                .dislikesCount(dislikes)
                .ingredients(ingredientDTOs);
        var reactions = recipe.getReactions();
        Optional<ReactionModel> reactionOpt = reactions.stream()
                .filter(reaction -> reaction.getUser().getUsername().equals(username))
                .findFirst();
        if (reactionOpt.isEmpty()) {
            resultBuilder.doesUserLikeOrDislikeTheRecipe(0);
            return resultBuilder.build();
        }
        var userReaction = reactionOpt.get();
        if(userReaction.isLike()) {
            resultBuilder.doesUserLikeOrDislikeTheRecipe(1);
        } else {
            resultBuilder.doesUserLikeOrDislikeTheRecipe(-1);
        }
        return resultBuilder.build();

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