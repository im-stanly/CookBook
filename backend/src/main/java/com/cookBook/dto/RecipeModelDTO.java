package com.cookBook.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecipeModelDTO {
    private long id;
    private String name;
    private String description;
    private int likesCount;
    private int dislikesCount;
    private List<IngredientModelDTO> ingredients;
    private int doesUserLikeOrDislikeTheRecipe;
}
