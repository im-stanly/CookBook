package com.cookBook.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.cookBook.dto.RecipeModelDTO;
import com.cookBook.dto.UserInputIngredientDTO;
import com.cookBook.entity.ReactionModel;
import com.cookBook.entity.RecipeModel;
import com.cookBook.entity.UserModel;
import com.cookBook.repository.ReactionRepository;
import com.cookBook.repository.RecipeRepository;
import com.cookBook.repository.UserRepository;
import com.cookBook.service.IngredientService;
import com.cookBook.service.RecipeService;

@RestController
@RequestMapping("/recipe")
public class RecipeController {
    @Autowired
    public IngredientService ingredientService;

    @Autowired
    public RecipeService recipeService;

    @Autowired
    private ReactionRepository reactionRepository;
    @Autowired
    private RecipeRepository recipeRepository;
    @Autowired
    private UserRepository userRepository;

//    @GetMapping("/all")
//    public List<RecipeModelDTO> getAllRecipes() {
//        return recipeService.getAllRecipes();
//    }

    @PostMapping("/byIngredients")
    public Map<Integer, List<RecipeModelDTO>> getRecipe(@RequestHeader(value = "user-token") String userToken, @RequestBody List<UserInputIngredientDTO> ingredients){
        // TODO: Limit the number of queries
//        if(!UserTokenUtils.isTokenValid(userToken))
//            return null;
//        if(!UserTokenUtils.isVerified(userToken))
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return recipeService.getRecipesByIngredients(ingredients,username);
    }

    @PostMapping("/byText")
    public Map<Integer, List<RecipeModelDTO>> getRecipeByPlainText(@RequestHeader(value = "user-token") String userToken, @RequestBody String ingredients){
        // TODO: Limit the number of queries
//        if(!UserTokenUtils.isTokenValid(userToken))
//            return null;
//        if(!UserTokenUtils.isVerified(userToken))

        System.out.println("Received ingredients: " + ingredients);

        List <UserInputIngredientDTO> ingredientList = new ArrayList<>();
        ingredientList.add(new UserInputIngredientDTO("Milk", "Cup", 10));
        ingredientList.add(new UserInputIngredientDTO("Egg", "Piece", 20));
        ingredientList.add(new UserInputIngredientDTO("Flour", "Cup", 10));
        ingredientList.add(new UserInputIngredientDTO("Cream", "Cup", 10));
        ingredientList.add(new UserInputIngredientDTO("Banana", "Piece", 10));
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return recipeService.getRecipesByIngredients(ingredientList,username);
    }

    @GetMapping("/ingredients/{ingName}")
    public Map<String, List<String>> getPossibleIngredients(@PathVariable("ingName") String ingredientName) {
        if(ingredientName == null || ingredientName.length() < 3)
            return Map.of();
        return ingredientService.getAllIngredientsWithConversions(ingredientName);
    }

    @PostMapping("/{recipeId}/react")
    public ResponseEntity<String> addReaction(
            @PathVariable long recipeId,
            @RequestParam boolean isLike,
            @RequestParam String username
    ) {
        RecipeModel recipe = recipeRepository.findById(recipeId).orElse(null);
        if (recipe == null) {
            return ResponseEntity.badRequest().body("Recipe not found.");
        }

        Optional<UserModel> userOPT = userRepository.findByUsername(username);
        if (userOPT.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found.");
        }
        UserModel user = userOPT.get();
        ReactionModel reaction = reactionRepository
            .findAll()
            .stream()
            .filter(r -> r.getUser().getUsername().equals(username) && r.getRecipe().getId() == recipeId)
            .findFirst()
            .orElse(new ReactionModel());

        reaction.setUser(user);
        reaction.setRecipe(recipe);
        reaction.setLike(isLike);

        reactionRepository.save(reaction);
        return ResponseEntity.ok("Reaction recorded successfully.");
    }
    @DeleteMapping("/{recipeId}/react")
    private ResponseEntity<String> deleteReaction(
            @PathVariable long recipeId,
            @RequestParam String username
    ) {
        reactionRepository.deleteByUserUsernameAndRecipeId(username, recipeId);
        return ResponseEntity.ok("Reaction deleted successfully");
    }
}