package com.cookBook.repository;

import com.cookBook.entity.IngredientModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IngredientRepository extends JpaRepository<IngredientModel,Long> {

    List<IngredientModel> findByNameContainingIgnoreCase(String name);
}
