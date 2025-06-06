package com.cookBook.service;

import com.cookBook.entity.UserModel;
import com.cookBook.dto.UserModelDTO;

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
                .build();
    }
}