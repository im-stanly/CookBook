package com.cookBook.service;

import com.cookBook.dto.UserIngredientModelDTO;
import com.cookBook.entity.UserIngredientModel;
import com.cookBook.entity.UserModel;
import com.cookBook.dto.UserModelDTO;

import java.util.stream.Collectors;

public class UserModelMapper {
    static UserModel onto(UserModelDTO userDTO) {
        if (userDTO == null) return null;
        return UserModel.builder()
                .id(userDTO.getId())
                .email(userDTO.getEmail())
                .username(userDTO.getUsername())
                .verified(userDTO.isVerified())
                .password(userDTO.getPassword())
                .build();
    }

    static UserModelDTO from(UserModel userModel) {
        if (userModel == null) return null;
        return UserModelDTO.builder()
                .id(userModel.getId())
                .email(userModel.getEmail())
                .isVerified(userModel.isVerified())
                .username(userModel.getUsername())
                .userIngredients(
                        userModel.getUserIngredients() == null ? null :
                                userModel.getUserIngredients()
                                        .stream()
                                        .map(UserModelMapper::mapUserIngredient)
                                        .collect(Collectors.toList())
                )
                .build();
    }
    private static UserIngredientModelDTO mapUserIngredient(UserIngredientModel userIngredient) {
        return UserIngredientModelDTO.builder()
                .ingredientName(userIngredient.getIngredient().getName())
                .quantity(userIngredient.getQuantity())
                .measurementUnitName(userIngredient.getMeasurementUnit().getName())
                .build();
    }
}