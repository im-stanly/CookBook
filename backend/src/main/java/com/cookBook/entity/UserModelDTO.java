package com.cookBook.entity;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UserModelDTO {
    private int id;
    private String email;
    private String username;
    private String password;
}