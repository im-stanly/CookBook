package com.cookBook.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@Builder
@Table(name = "INGREDIENTS")
@AllArgsConstructor
@NoArgsConstructor
public class IngredientModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private long id;


    @Column(name = "NAME",nullable = false)
    private String name;

    @ManyToOne
    @JoinTable(
            name = "INGREDIENTS_SUPERSETS",
            joinColumns = @JoinColumn(name = "INGREDIENT_ID"),
            inverseJoinColumns = @JoinColumn(name = "SUBINGREDIENT_ID")
    )
    private IngredientModel SuperIngredients;

    @Column(name = "APPROXIMATE_CALORIES_PER_100_GRAM",nullable = false)
    private long approximateCaloriesPer100Gram;




}
