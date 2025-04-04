package com.cookBook.repository;

import com.cookBook.entity.IngredientInRecipeModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredientsInRecipesRepository extends JpaRepository<IngredientInRecipeModel,Long> {

}
