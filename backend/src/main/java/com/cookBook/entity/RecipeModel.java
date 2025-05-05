package com.cookBook.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Builder
@Table(name = "RECIPES")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RecipeModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private long id;

    @Column(name = "DESCRIPTION",nullable = false)
    private String description;

    @Column(name = "NAME",nullable = false)
    private String name;

    @OneToMany(mappedBy = "recipe")
    private Set<ReactionModel> reactions;

    @OneToMany(mappedBy = "recipe")
    private Set<IngredientInRecipeModel> ingredients;

    @ManyToOne
    @JoinTable(
            name = "RECIPES_FOR_DISHES",
            joinColumns = @JoinColumn(name = "RECIPE_ID"),
            inverseJoinColumns = @JoinColumn(name = "DISH_ID")
    )
    private DishModel dish;
}
