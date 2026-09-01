package com.FoodDeliveryApp.foodiesapi.controller;
import com.FoodDeliveryApp.foodiesapi.io.AuthenticationRequest;
import com.FoodDeliveryApp.foodiesapi.io.AuthenticationResponse;
import com.FoodDeliveryApp.foodiesapi.service.AppUserDetailsService;
import com.FoodDeliveryApp.foodiesapi.util.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    // =========================================================
    // NORMAL USER LOGIN
    // =========================================================
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody AuthenticationRequest request
    ) {
        try {
            if (
                    request.getEmail() == null
                            ||
                            request.getEmail().trim().isEmpty()
            ) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Email is required");
            }
            if (
                    request.getPassword() == null
                            ||
                            request.getPassword().isEmpty()
            ) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Password is required");
            }
            String email =
                    request.getEmail().trim();
            // =================================================
            // AUTHENTICATE NORMAL USER
            // =================================================
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            email,
                            request.getPassword()
                    )
            );
            // =================================================
            // LOAD USER
            // =================================================
            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(
                            email
                    );
            // =================================================
            // GENERATE JWT
            // =================================================
            String jwtToken =
                    jwtUtil.generateToken(
                            userDetails
                    );
            // =================================================
            // RESPONSE
            // =================================================
            AuthenticationResponse response =
                    new AuthenticationResponse(
                            email,
                            jwtToken
                    );
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            "Invalid email or password"
                    );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            "Login failed"
                    );
        }
    }
}