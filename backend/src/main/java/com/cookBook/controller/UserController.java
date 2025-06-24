package com.cookBook.controller;

import com.cookBook.dto.UserIngredientModelDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.cookBook.config.UserTokenUtils;
import com.cookBook.dto.UserModelDTO;
import com.cookBook.service.UserService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping("")
    public List<UserModelDTO> getUsers() {
        return userService.getUsers();
    }

    @GetMapping("/username/{username}")
    public UserModelDTO findByUsername(@PathVariable("username") String username) {
        return userService.findByUsername(username);
    }

    @GetMapping("/token")
    public UserModelDTO getUserByToken(@RequestHeader(value = "user-token") String userToken) {
        return userService.findById(UserTokenUtils.getUserID(userToken));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> add(@RequestBody UserModelDTO newAccount) {
        if (newAccount.isVerified())
            newAccount.setVerified(false);

        try{
            if (userService.save(newAccount) != null)
                return ResponseEntity.ok(createSuccessResponse("Account created successfully."));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(createErrorResponse(ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(createErrorResponse(ex.getMessage()));
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(createErrorResponse("Server Error."));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody UserModelDTO loginData) {
        Map<String, String> response = new HashMap<>();
        try {
            String token = userService.getLoginToken(loginData);

            response.put("success", "true");
            response.put("message", "User authenticated successfully.");
            response.put("token", token);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(createErrorResponse("Wrong username or password."));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(createErrorResponse("Server Error."));
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify")
    public ResponseEntity<Map<String,String>> verifyEmail(@RequestParam("token") String token) {
        Map<String,String> resp = new HashMap<>();
        try {
            String msg = userService.verify(token);
            resp.put("success","true");
            resp.put("message", msg);
            return ResponseEntity.ok(resp);
        } catch (RuntimeException ex) {
//            resp.put("success","false");
//            resp.put("error", ex.getMessage());
            resp.put("success","true");
            resp.put("warning message(ignore)", ex.getMessage());
            return ResponseEntity.badRequest().body(resp);
        }
    }

    @DeleteMapping("/username/{username}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable("username") String username, @RequestHeader(value = "user-token") String userToken) {
        ResponseEntity<Map<String, String>> checkIfAccess = isOwnerOrAdmin(username, userToken);

        if (checkIfAccess != null) return checkIfAccess;
        Map<String, String> response = new HashMap<>();

        try {
            userService.delete(UserTokenUtils.getUserID(userToken));
            response.put("success", "true");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(createErrorResponse("Server Error."));
        }

        return ResponseEntity.ok(response);
    }

    private Map<String, String> createErrorResponse(String errorMessage) {
        Map<String, String> response = new HashMap<>();
        response.put("success", "false");
        response.put("error", errorMessage);
        return response;
    }

    private Map<String, String> createSuccessResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("success", "true");
        response.put("message", message);
        return response;
    }

    private ResponseEntity<Map<String, String>> isOwnerOrAdmin(String username, String userToken) {
        if (!UserTokenUtils.isTokenValid(userToken))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(createErrorResponse("Your session has end, please log in again"));

        String usernameFromToken = UserTokenUtils.getUsername(username);
        if (!UserTokenUtils.isAdmin(userToken) && (usernameFromToken == null || !usernameFromToken.equals(username)))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(createErrorResponse("You don't have permissions to do delete this user"));

        return null;
    }

    @PostMapping("/updateFridge")
    public ResponseEntity<?> updateUserIngredients(@RequestHeader("user-token") String userToken,
                                                   @RequestBody List<UserIngredientModelDTO> ingredientsDTO) {
        try {
            userService.updateUserIngredients(UserTokenUtils.getUserID(userToken), ingredientsDTO);
            return ResponseEntity.ok().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }
}