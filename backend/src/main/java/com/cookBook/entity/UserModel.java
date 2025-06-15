package com.cookBook.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Builder
@Table(name = "USERS")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private long id;

    @Column(name = "USERNAME",nullable = false, unique = true)
    private String username;

    @Column(name = "PASSWORD",nullable = false)
    private String password;
    @OneToMany(mappedBy = "user")
    private List<ReactionModel> reactions;
    @Column(name = "EMAIL")
    private String email;

    @OneToMany(mappedBy = "user")
    private List<UserIngredientModel> userIngredients;


    @Column(name = "VERIFIED", nullable = false)
    private boolean verified;

    @Transient
    private UserPermission userPermissions = UserPermission.USER;

}