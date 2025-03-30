package com.cookBook.controller;

import com.cookBook.entity.RecipeModel;
import com.cookBook.repository.RecipeRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class WelcomeController {

    RecipeRepository recipeRepository;
    WelcomeController(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }
    @GetMapping("testRecipeRepository")
    public String testRecipeRepository() {
        Optional<RecipeModel> testRecipe = recipeRepository.findById(1);
        if(!testRecipe.isPresent()) {
            return "Recipe with id 1 not present in database";
        }
        return testRecipe.get().getName().concat(" with description ").concat(testRecipe.get().getDescription());
    }
    @GetMapping("")
    public String greetings(){

        return "Hello in the Cook Book!";
    }
}