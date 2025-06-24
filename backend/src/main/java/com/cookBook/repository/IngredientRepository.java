package com.cookBook.repository;

import com.cookBook.entity.IngredientModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface IngredientRepository extends JpaRepository<IngredientModel,Long> {

    Optional<IngredientModel> findByName(String name);
    List<IngredientModel> findByNameContainingIgnoreCase(String name);
}
