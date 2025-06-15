package com.cookBook.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import com.cookBook.dto.UserModelDTO;
import com.cookBook.entity.UserPermission;
import com.cookBook.service.UserService;

public class UserTokenUtils {
    private static final long EXPIRATION_TIME = 3600000; // 1 hour
    private static final Key SIGNING_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    @Autowired
    public UserService userService;

    public static String generateToken(long id, String email, String username, String role, boolean isVerified) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", id);
        claims.put("email", email);
        claims.put("username", username);
        claims.put("role", role);
        claims.put("isVerified", isVerified);

        long now = System.currentTimeMillis();
        Date expirationDate = new Date(now + EXPIRATION_TIME);

        return Jwts.builder().setClaims(claims).setExpiration(expirationDate).signWith(SIGNING_KEY, SignatureAlgorithm.HS256).compact();
    }

    public static boolean isTokenValid(String token) {
        try {
            Claims claims = getTokenClaims(token);
            if (claims == null) throw new RuntimeException("claims are null");
            Date expirationDate = claims.getExpiration();
            Date currentDate = new Date();

            return !expirationDate.before(currentDate);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    public static boolean isAdmin(String token) {
        Claims claims = getTokenClaims(token);
        if (claims == null) return false;

        String role = (String) claims.get("role");

        return role != null && claims.get("role").equals(UserPermission.ADMIN.name());
    }

    public static int getUserID(String token) {
        Claims claims = getTokenClaims(token);
        return claims != null ? (int) claims.get("id") : -1;
    }

    public static String getUsername(String token){
        Claims claims = getTokenClaims(token);
        return claims != null ? (String) claims.get("username") : null;
    }

    public static boolean isVerified(String token) {
        Claims claims = getTokenClaims(token);
        if (claims == null) return false;

        if(!((String)claims.get("isVerified")).equals("true"))
            return true;

        //pobrać z bazy danych i sprawdzić czy tam verified, lub podczas veryfikacji odświeżyć mu token

        return false;
    }

    private UserModelDTO getUserByToken(String token){
        int userId = getUserID(token);

        if(userId == -1)
            return null;

        return userService.findById(userId);
    }

    private static Claims getTokenClaims(String token) {
        try {
            if (token == null || token.isEmpty()) return null;

            return Jwts.parserBuilder().setSigningKey(SIGNING_KEY).build().parseClaimsJws(token).getBody();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }
}