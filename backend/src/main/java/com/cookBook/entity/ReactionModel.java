package com.cookBook.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Table(name = "LIKES")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReactionModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private long id;

    @OneToOne
    @JoinColumn(name = "USER_ID",nullable = false)
    private UserModel user;
    @OneToOne
    @JoinColumn(name = "RECIPE_ID",nullable = false)
    private RecipeModel recipe;

    @Column(name = "POSITIVE", nullable = false)
    private boolean isLike;
}
