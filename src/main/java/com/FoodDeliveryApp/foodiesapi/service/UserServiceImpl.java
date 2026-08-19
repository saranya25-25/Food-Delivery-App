package com.FoodDeliveryApp.foodiesapi.service;

import com.FoodDeliveryApp.foodiesapi.entity.UserEntity;
import com.FoodDeliveryApp.foodiesapi.io.UserRequest;
import com.FoodDeliveryApp.foodiesapi.io.UserResponse;
import com.FoodDeliveryApp.foodiesapi.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationFacade authenticationFacade;

    @Override
    public UserResponse registerUser(UserRequest request) {

        UserEntity newUser = convertToEntity(request);

        newUser = userRepository.save(newUser);

        return convertToResponse(newUser);
    }

    @Override
    public String findByUserId() {

        String loggedInUserEmail =
                authenticationFacade.getAuthentication().getName();

        UserEntity loggedInUser =
                userRepository.findByEmail(loggedInUserEmail)
                        .orElseThrow(
                                () -> new UsernameNotFoundException(
                                        "User not found"
                                )
                        );

        return loggedInUser.getId();
    }

    @Override
    public UserResponse getProfile() {
        String userId = findByUserId();
        UserEntity user =
                userRepository.findById(userId)
                        .orElseThrow(
                                () -> new UsernameNotFoundException(
                                        "User not found"
                                )
                        );

        return convertToResponse(user);
    }
    @Override
    public UserResponse updateProfile(UserRequest request) {
        String userId = findByUserId();

        UserEntity user =
                userRepository.findById(userId)
                        .orElseThrow(
                                () -> new UsernameNotFoundException(
                                        "User not found"
                                )
                        );

        user.setName(request.getName());
        user.setAddress(request.getAddress());
        user = userRepository.save(user);
        return convertToResponse(user);
    }
    private UserEntity convertToEntity(UserRequest request) {
        return UserEntity.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .address(request.getAddress())
                .build();
    }
    private UserResponse convertToResponse(UserEntity user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .address(user.getAddress())
                .build();
    }
}