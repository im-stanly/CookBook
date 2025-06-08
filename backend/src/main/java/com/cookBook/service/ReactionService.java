package com.cookBook.service;

import com.cookBook.repository.ReactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReactionService {
    @Autowired
    ReactionRepository reactionRepository;
    @Transactional
    public void deleteReactionByUsernameAndRecipeId(String username,long recipeId) {
        reactionRepository.deleteByUserUsernameAndRecipeId(username, recipeId);
    }
}
