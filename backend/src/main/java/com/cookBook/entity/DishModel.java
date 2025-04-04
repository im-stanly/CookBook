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
@Table(name = "DISHES")
@AllArgsConstructor
@NoArgsConstructor
public class DishModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private long id;

    @OneToMany(mappedBy = "dish")
    List<RecipeModel> recipes;
}
