package com.FoodDeliveryApp.foodiesapi.service;

import com.FoodDeliveryApp.foodiesapi.io.UserRequest;
import com.FoodDeliveryApp.foodiesapi.io.UserResponse;

public interface UserService {
    UserResponse registerUser(UserRequest request);

    String findByUserId();
}
