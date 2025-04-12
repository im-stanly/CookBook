package com.cookBook.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Builder
@Table(name = "DISHES")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DishModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private long id;

    @OneToMany(mappedBy = "dish")
    List<RecipeModel> recipes;
}
