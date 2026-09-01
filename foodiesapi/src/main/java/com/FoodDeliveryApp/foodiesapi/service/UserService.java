package com.FoodDeliveryApp.foodiesapi.service;
import com.FoodDeliveryApp.foodiesapi.io.UserRequest;
import com.FoodDeliveryApp.foodiesapi.io.UserResponse;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
public interface UserService {
    UserResponse registerUser(UserRequest request);
    String findByUserId();
    UserResponse getProfile();
    UserResponse updateProfile(UserRequest request);
    UserResponse uploadProfileImage(
            MultipartFile file
    ) throws IOException;
    UserResponse deleteProfileImage()
            throws IOException;
}