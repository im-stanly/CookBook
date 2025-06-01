package com.cookBook.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import com.cookBook.config.UserTokenUtils;
import com.cookBook.entity.UserModel;
import com.cookBook.dto.UserModelDTO;
import com.cookBook.entity.VerificationToken;
import com.cookBook.repository.UserRepository;
import com.cookBook.repository.VerificationTokenRepository;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository tokenRepo;
    @Autowired
    private JavaMailSender mailSender;

    public List<UserModelDTO> getUsers() {
        return userRepository.findAll().stream().map(UserModelMapper::from).toList();
    }

    public UserModelDTO save(UserModelDTO newUser) {
        if (!EmailValidation.isEmailValid(newUser.getEmail()))
            throw new RuntimeException("Email address not valid");

        if(!newUser.getEmail().contains("@student.uj.edu.pl"))
            throw new RuntimeException("Email must be @student.uj.edu.pl domain");

        String encryptedPassword = EncoderPassword.encode(newUser.getPassword());
        newUser.setPassword(encryptedPassword);

        UserModel saved = userRepository.save(UserModelMapper.onto(newUser));

        VerificationToken vToken = VerificationToken.builder()
                .token(UUID.randomUUID().toString())
                .user(saved)
                .expiryDate(LocalDateTime.now().plusHours(24))
                .build();
        tokenRepo.save(vToken);
        sendVerificationEmail(saved.getEmail(), vToken.getToken());
        return UserModelMapper.from(saved);
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
        return UserTokenUtils.generateToken(account.getId(), account.getEmail(), account.getUsername(), account.getUserPermissions().name(), account.isVerified());
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

    private void sendVerificationEmail(String email, String token) {
        String link = "http://localhost:8080/user/verify?token=" + token;
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(email);
        msg.setSubject("Please Verify Your Email");
        msg.setText("Click to verify: " + link);
        mailSender.send(msg);
    }

    public String verify(String token) {
        VerificationToken vToken = tokenRepo.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));
        if (vToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }
        UserModel user = vToken.getUser();
        user.setVerified(true);
        userRepository.save(user);
        tokenRepo.deleteByToken(token);
        return "User verified successfully";
    }
}