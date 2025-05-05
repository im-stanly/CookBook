package com.cookBook.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class IngredientModelDTO {
    private String name;
    private String unitName;
    private Float amountRangeStart;
    private Float amountRangeEnd;
    private String preciseIngredientName;
    private long approximateCaloriesPer100Gram;
}
