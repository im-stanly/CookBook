package com.cookBook.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@Table(name = "INGREDIENTS_IN_RECIPES")
@AllArgsConstructor
@NoArgsConstructor
public class IngredientInRecipeModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private long id;

    @ManyToOne
    @JoinColumn(name = "RECIPE_ID")
    private RecipeModel recipe;

    @OneToOne
    @JoinColumn(name = "INGREDIENT_ID",nullable = false)
    private IngredientModel ingredient;

    @OneToOne
    @JoinColumn(name = "MEASUREMENT_UNIT_ID",nullable = false)
    private MeasurementUnitModel measurementUnit;

    @Column(name = "AMOUNT_RANGE_START",nullable = false)
    private Float amountRangeStart;

    @Column(name = "AMOUNT_RANGE_END")
    private Float amountRangeEnd;
}
