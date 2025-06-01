package com.cookBook.repository;
import com.cookBook.entity.RecipeModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RecipeRepository extends JpaRepository<RecipeModel,Long> {
    Optional<RecipeModel> findById(long id);

    @EntityGraph(attributePaths = {
            "ingredients.ingredient",
            "ingredients.measurementUnit",
            "reactions"
    })
    @Query("""
           SELECT DISTINCT r
           FROM RecipeModel r
           WHERE (
               SELECT COUNT(i2)
               FROM IngredientInRecipeModel i2
               WHERE i2.recipe = r
                 AND i2.ingredient.name NOT IN :allowedIngredients
           ) <= :howManyMissmatch
           """)
    List<RecipeModel> findRecipesByAllowedIngredients(
            @Param("allowedIngredients") List<String> allowedIngredients,
            @Param("howManyMissmatch") int howManyMissmatch);
}
