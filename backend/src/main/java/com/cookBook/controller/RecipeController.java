package com.cookBook.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.cookBook.dto.RecipeModelDTO;
import com.cookBook.dto.UserInputIngredientDTO;
import com.cookBook.service.IngredientService;
import com.cookBook.service.RecipeService;

@RestController
@RequestMapping("/recipe")
public class RecipeController {
    @Autowired
    public IngredientService ingredientService;

    @Autowired
    public RecipeService recipeService;

    @GetMapping("/all")
    public List<RecipeModelDTO> getAllRecipes() {
        return recipeService.getAllRecipes();
    }

    @PostMapping("/byIngredients")
    public List<RecipeModelDTO> getRecipe(@RequestHeader(value = "user-token") String userToken, @RequestBody List<UserInputIngredientDTO> ingredients){
        // TODO: Check if the user is logged and limit the number of queries
        return recipeService.getRecipesByIngredients(ingredients);
    }

    @GetMapping("/ingredients/{ingName}")
    public Map<String, List<String>> getPossibleIngredients(@PathVariable("ingName") String ingredientName) {
        if(ingredientName == null || ingredientName.length() < 3)
            return Map.of();
        return ingredientService.getAllIngredientsWithConversions(ingredientName);
    }
}
