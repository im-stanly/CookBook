package com.cookBook.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.cookBook.entity.IngredientModel;
import com.cookBook.repository.IngredientRepository;

@Service
public class IngredientService {
    @Autowired
    public IngredientRepository ingredientRepository;

    public List<String> getAllIngredients() {
        return ingredientRepository.findAll().stream()
                .map(IngredientModel::getName)
                .toList();
    }

    @Transactional(readOnly = true)
    public Map<String, List<String>> getAllIngredientsWithConversions() {
        return ingredientRepository.findAll().stream()
                .collect(Collectors.toMap(
                        IngredientModel::getName,
                        ingredient -> ingredient.getUsagesInRecipes().stream()
                                .map(usage -> usage.getMeasurementUnit().getName())
                                .distinct()
                                .collect(Collectors.toList())
                ));
    }
}
