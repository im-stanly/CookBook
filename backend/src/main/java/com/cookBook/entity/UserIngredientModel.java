package com.cookBook.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "USER_INGREDIENTS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserIngredientModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "USER_ID", nullable = false)
    private UserModel user;

    @ManyToOne
    @JoinColumn(name = "INGREDIENT_ID", nullable = false)
    private IngredientModel ingredient;

    @Column(name = "QUANTITY", nullable = false)
    private Long quantity;

    @ManyToOne
    @JoinColumn(name = "MEASUREMENT_UNIT_ID", nullable = false)
    private MeasurementUnitModel measurementUnit;
}
