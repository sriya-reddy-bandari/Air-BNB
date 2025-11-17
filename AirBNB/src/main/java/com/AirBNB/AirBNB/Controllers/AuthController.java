package com.AirBNB.AirBNB.Controllers;



import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.AirBNB.AirBNB.JWT.JwtUtilis;
import com.AirBNB.AirBNB.Models.Role;
import com.AirBNB.AirBNB.Models.User;
import com.AirBNB.AirBNB.Repositories.UserRepository;

@RestController
@RequestMapping("/api/auth")

public class AuthController {
	
	@Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtilis jwtUtilis;

    
    @PostMapping("/login_in/{role}")
    public ResponseEntity<?> login(@PathVariable String role, @RequestBody User loginRequest) {

        // 1️⃣ Find user from DB
        User existingUser = userRepository.findByUsername(loginRequest.getUsername())
                .orElse(null);

        if (existingUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password!");
        }

        // 2️⃣ Convert role path variable to Enum
        Role expectedRole;
        try {
            expectedRole = Role.valueOf("ROLE_" + role.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role type!");
        }

        // 3️⃣ Validate role match
        if (!existingUser.getRole().equals(expectedRole)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Access denied! Please log in from correct portal (" + existingUser.getRole() + ")");
        }

        // 4️⃣ Authenticate username & password
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 5️⃣ Generate JWT token
            String token = jwtUtilis.generateToken(authentication);

            // 6️⃣ Return token with role info
            return ResponseEntity.ok(Map.of("token", token));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password!");
        }
    }



    @PostMapping("/sign_in/{role}")
    public ResponseEntity<?> register(@PathVariable String role, @RequestBody User user) {

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists!");
        }

        // Set role from path ( admin /host/guest)
        switch (role.toLowerCase()) {
            case "admin" -> user.setRole(Role.ROLE_ADMIN);
            case "host"  -> user.setRole(Role.ROLE_HOST);
            case "guest" -> user.setRole(Role.ROLE_GUEST);
            default -> {
                return ResponseEntity.badRequest().body("Invalid role type!");
            }
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully as " + user.getRole());
    }

}
