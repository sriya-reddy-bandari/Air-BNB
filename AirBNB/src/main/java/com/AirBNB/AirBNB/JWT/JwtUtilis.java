package com.AirBNB.AirBNB.JWT;

import java.security.Key;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.AirBNB.AirBNB.Models.JwtToken;
import com.AirBNB.AirBNB.Models.Role;
import com.AirBNB.AirBNB.Repositories.JwtTokenRepository;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j   
@Component
public class JwtUtilis {


	    @Autowired
	    private JwtTokenRepository jwtTokenRepository;

	    private static final Logger logger = LoggerFactory.getLogger(JwtUtilis.class);

	    private final String JwtSecret = "TXlTZWNyZXRkZmpnc2pmaGpzZmt1ZWpoZmplcmhma2plcmhmal9zZWN1cmVLZXk=";
	    private final long JwtExpirationMs = 2147483000L;

	 // ✅ FIXED: Added .trim() to ensure no hidden whitespace is included
	    public String getJwtFromHeader(HttpServletRequest request) {
	        String bearerToken = request.getHeader("Authorization");
	        logger.debug("Authorization Header: {}", bearerToken);
	        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
	            return bearerToken.substring(7).trim(); // <-- ADDED TRIM HERE
	        }
	        return null;
	    }

	    // ✅ Generate JWT token and store Enum role as its name
	    public String generateToken(Authentication authentication) {
	        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
	        String username = userPrincipal.getUsername();

	        // Example: ROLE_HOST, ROLE_GUEST
	        String roleName = userPrincipal.getAuthorities().iterator().next().getAuthority();

	        String token = Jwts.builder()
	                .setSubject(username)
	                .claim("role", roleName) // storing role as enum string
	                .setIssuedAt(new Date())
	                .setExpiration(new Date(System.currentTimeMillis() + JwtExpirationMs))
	                .signWith(key(), SignatureAlgorithm.HS256)
	                .compact();

	        // ✅ FIXED: Added .trim() before saving to ensure clean database storage
	        String cleanToken = token.trim(); 
	        JwtToken jwtToken = new JwtToken(username, roleName, cleanToken);
	        jwtTokenRepository.save(jwtToken);

	        return token; // Return the token that was successfully saved
	    }

	    // ✅ Get username from JWT
	    public String getUserNameFromJwtToken(String token) {
	        return Jwts.parserBuilder()
	                .setSigningKey(key())
	                .build()
	                .parseClaimsJws(token)
	                .getBody()
	                .getSubject();
	    }

	    // ✅ Extract Enum Role from JWT
	    public Role getRoleFromToken(String token) {
	        String roleStr = Jwts.parserBuilder()
	                .setSigningKey(key())
	                .build()
	                .parseClaimsJws(token)
	                .getBody()
	                .get("role", String.class);

	        try {
	            return Role.valueOf(roleStr); // Convert string back to Enum
	        } catch (IllegalArgumentException e) {
	            logger.error("Invalid role found in JWT: {}", roleStr);
	            return null;
	        }
	    }

	    private Key key() {
	        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(JwtSecret));
	    }

	    // ✅ Validate JWT Token and check existence in DB
	    public boolean validateJwtToken(String authToken) {
	        // The authToken passed here should already be trimmed by getJwtFromHeader 
	        try {
	            JwtToken existingToken = jwtTokenRepository.findByToken(authToken);
	            if (existingToken == null) {
	                logger.error("JWT token not found in database! The queried token was: {}", authToken);
	                return false;
	            }

	            Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(authToken);
	            return true;

	        } catch (MalformedJwtException e) {
	            logger.error("Invalid JWT token: {}", e.getMessage());
	        } catch (ExpiredJwtException e) {
	            logger.error("JWT token is expired: {}", e.getMessage());
	        } catch (UnsupportedJwtException e) {
	            logger.error("JWT token is unsupported: {}", e.getMessage());
	        } catch (IllegalArgumentException e) {
	            logger.error("JWT claims string is empty: {}", e.getMessage());
	        }

	        return false;
	    }

	}




