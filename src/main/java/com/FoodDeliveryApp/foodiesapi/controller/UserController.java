package com.FoodDeliveryApp.foodiesapi.controller;

import com.FoodDeliveryApp.foodiesapi.io.UserRequest;
import com.FoodDeliveryApp.foodiesapi.io.UserResponse;
import com.FoodDeliveryApp.foodiesapi.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(
            @RequestBody UserRequest request
    ) {
        return userService.registerUser(request);
    }

    @GetMapping("/profile")
    public UserResponse getProfile() {
        return userService.getProfile();
    }

    @PutMapping("/profile")
    public UserResponse updateProfile(
            @RequestBody UserRequest request
    ) {
        return userService.updateProfile(request);
    }
}