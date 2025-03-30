package com.cookBook.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@Table(name = "RECIPES")
@AllArgsConstructor
@NoArgsConstructor
public class RecipeModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private long id;

    @Column(name = "DESCRIPTION",nullable = false)
    private String description;

    @Column(name = "NAME",nullable = false)
    private String name;
}
