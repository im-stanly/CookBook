package com.cookBook.repository;

import com.cookBook.entity.ReactionModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReactionRepository extends JpaRepository<ReactionModel,Long> {
    void deleteByUserUsernameAndRecipeId(String username, Long recipeId);
}
