package com.cookBook.controller;

import com.cookBook.config.UserTokenUtils;
import com.cookBook.dto.RecipeModelDTO;
import com.cookBook.dto.UserInputIngredientDTO;
import com.cookBook.dto.PlainTextIngredientsRequestDTO;
import com.cookBook.entity.ReactionModel;
import com.cookBook.entity.RecipeModel;
import com.cookBook.entity.UserModel;
import com.cookBook.repository.ReactionRepository;
import com.cookBook.repository.RecipeRepository;
import com.cookBook.repository.UserRepository;
import com.cookBook.service.IngredientService;
import com.cookBook.service.ReactionService;
import com.cookBook.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/recipe")
public class RecipeController {
    @Autowired
    public IngredientService ingredientService;

    @Autowired
    public RecipeService recipeService;

    @Autowired
    public ReactionService reactionService;

    @Autowired
    private ReactionRepository reactionRepository;
    @Autowired
    private RecipeRepository recipeRepository;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/byIngredients")
    public Map<Integer, List<RecipeModelDTO>> getRecipe(@RequestHeader(value = "user-token") String userToken, @RequestBody List<UserInputIngredientDTO> ingredients){
        // TODO: Limit the number of queries
//        if(!UserTokenUtils.isTokenValid(userToken))
//            return null;
//        if(!UserTokenUtils.isVerified(userToken))
        String username = UserTokenUtils.getUsername(userToken);
        return recipeService.getRecipesByIngredients(ingredients,username);
    }

    @PostMapping("/byText")
    public List<Map<String, String>> getRecipeByPlainText(@RequestHeader(value = "user-token") String userToken, @RequestBody PlainTextIngredientsRequestDTO requestDTO){
        // TODO: Limit the number of queries
//        if(!UserTokenUtils.isTokenValid(userToken))
//            return null;
//        if(!UserTokenUtils.isVerified(userToken))

        return recipeService.plainTextToIngredients(requestDTO.getIngredients());
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
        reactionService.deleteReactionByUsernameAndRecipeId(username,recipeId);
        return ResponseEntity.ok("Reaction deleted successfully");
    }
}