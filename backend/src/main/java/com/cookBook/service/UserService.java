package com.cookBook.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cookBook.config.UserTokenUtils;
import com.cookBook.entity.UserModel;
import com.cookBook.dto.UserModelDTO;
import com.cookBook.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    public List<UserModelDTO> getUsers() {
        return userRepository.findAll().stream().map(UserModelMapper::from).toList();
    }

    public UserModelDTO save(UserModelDTO newUser) {
        if (EmailValidation.isEmailValid(newUser.getEmail())) {
            throw new RuntimeException("Email address not valid");
        }

        String encryptedPassword = EncoderPassword.encode(newUser.getPassword());
        newUser.setPassword(encryptedPassword);

        return UserModelMapper.from(userRepository.save(UserModelMapper.onto(newUser)));
    }

    public void delete(long id) {
        userRepository.deleteById(id);
    }

    public UserModelDTO findById(int id) {
        UserModel response = userRepository.findById(id);
        if (response == null) {
            throw new RuntimeException("User with id: " + id + " doesn't exist");
        }
        return UserModelMapper.from(response);
    }

    public String getLoginToken(UserModelDTO loginData, String encryptedPassword) {
        UserModel account = userRepository.findByUsernameAndPassword(loginData.getUsername(), encryptedPassword);
        return UserTokenUtils.generateToken(account.getId(), account.getEmail(), account.getUsername(), account.getUserPermissions().name());
    }

    public String getLoginToken(UserModelDTO loginData) {
        String encryptedPassword = EncoderPassword.encode(loginData.getPassword());
        loginData.setPassword(encryptedPassword);
        return getLoginToken(loginData, encryptedPassword);
    }

    public boolean isUsernameTaken(String username) {
        return !userRepository.findByUsername(username).isEmpty();
    }

    public List<UserModelDTO> findByEmail(String email) {
        List<UserModel> response = userRepository.findByEmail(email);
        return response.stream().map(UserModelMapper::from).toList();
    }

    public UserModelDTO findByUsername(String username) {
        List<UserModel> response = userRepository.findByUsername(username);
        if (response.isEmpty()) {
            throw new RuntimeException("User with username: '" + username + "' doesn't exist");
        }
        return UserModelMapper.from(response.getFirst());
    }

    public UserModelDTO findByUsernameAndPassword(String username, String password) {
        UserModel response = userRepository.findByUsernameAndPassword(username, password);
        if (response == null) {
            throw new RuntimeException("Username or password is wrong");
        }
        return UserModelMapper.from(response);
    }
}