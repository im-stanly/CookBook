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
    @JoinColumn(name = "INGREDIENTS_SUPERSETS",nullable = false)
    private IngredientModel SuperIngredients;
}
