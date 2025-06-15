package com.cookBook.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserIngredientModelDTO {
    private String ingredientName;
    private long quantity;
    private String measurementUnitName;
}