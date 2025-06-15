package com.cookBook.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class UserModelDTO {
    private long id;
    private String username;
    private String password;
    private String email;
    private boolean isVerified;
    List<UserIngredientModelDTO> userIngredients;
}