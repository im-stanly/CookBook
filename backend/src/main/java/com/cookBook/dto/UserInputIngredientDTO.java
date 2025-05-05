package com.cookBook.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInputIngredientDTO {
    private String name;
    private String unit;
    private float amount;
}
