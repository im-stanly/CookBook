package com.cookBook.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.cookBook.entity.UserModel;

@Repository
public interface UserRepository extends JpaRepository<UserModel, Long> {


    UserModel findById(long id);
    List<UserModel> findByUsername(String username);
    List<UserModel> findByEmail(String email);
    UserModel findByUsernameAndPassword(String username, String password);
}