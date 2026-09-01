package com.FoodDeliveryApp.foodiesapi.service;
import com.FoodDeliveryApp.foodiesapi.entity.UserEntity;
import com.FoodDeliveryApp.foodiesapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Collections;
@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {
        // =====================================================
        // 1. FIND USER FROM MONGODB
        // =====================================================
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found with email: " + email
                        )
                );
        // =====================================================
        // 2. GET ROLE FROM DATABASE
        // =====================================================
        String role = user.getRole();
        // If role is missing, treat user as normal USER
        if (role == null || role.trim().isEmpty()) {
            role = "USER";
        }
        // Remove spaces and convert to uppercase
        role = role.trim().toUpperCase();
        // =====================================================
        // 3. CONVERT ROLE TO SPRING SECURITY FORMAT
        // =====================================================
        //
        // MongoDB:
        //
        // ADMIN
        //
        // becomes:
        //
        // ROLE_ADMIN
        //
        // SecurityConfig:
        //
        // hasRole("ADMIN")
        //
        // will then work correctly.
        // =====================================================
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }
        // =====================================================
        // 4. DEBUG LOG
        // =====================================================
        System.out.println("==========================================");
        System.out.println("USER AUTHENTICATION");
        System.out.println("EMAIL: " + user.getEmail());
        System.out.println("DATABASE ROLE: " + user.getRole());
        System.out.println("SPRING AUTHORITY: " + role);
        System.out.println("==========================================");
        // =====================================================
        // 5. RETURN SPRING SECURITY USER
        // =====================================================
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(
                        new SimpleGrantedAuthority(role)
                )
        );
    }
}