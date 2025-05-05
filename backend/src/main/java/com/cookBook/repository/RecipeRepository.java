package com.cookBook.repository;

import com.cookBook.entity.RecipeModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RecipeRepository extends JpaRepository<RecipeModel,Long> {
    Optional<RecipeModel> findById(long id);
}
