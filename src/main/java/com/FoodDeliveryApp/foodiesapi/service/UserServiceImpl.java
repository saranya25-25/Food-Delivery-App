package com.FoodDeliveryApp.foodiesapi.service;

import com.FoodDeliveryApp.foodiesapi.entity.UserEntity;
import com.FoodDeliveryApp.foodiesapi.io.UserRequest;
import com.FoodDeliveryApp.foodiesapi.io.UserResponse;
import com.FoodDeliveryApp.foodiesapi.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationFacade authenticationFacade;
    private final S3Service s3Service;


    // =========================================================
    // REGISTER
    // =========================================================

    @Override
    public UserResponse registerUser(UserRequest request) {

        UserEntity newUser = UserEntity.builder()
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .name(request.getName())
                .address(request.getAddress())
                .profileImageUrl(null)
                .build();

        newUser = userRepository.save(newUser);

        return convertToResponse(newUser);
    }


    // =========================================================
    // FIND USER ID
    // =========================================================

    @Override
    public String findByUserId() {

        String email = getLoggedInEmail();

        UserEntity user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found"
                        )
                );

        return user.getId();
    }


    // =========================================================
    // GET PROFILE
    // =========================================================

    @Override
    public UserResponse getProfile() {

        String email = getLoggedInEmail();

        UserEntity user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found"
                        )
                );

        return convertToResponse(user);
    }


    // =========================================================
    // UPDATE PROFILE
    // =========================================================

    @Override
    public UserResponse updateProfile(UserRequest request) {

        String email = getLoggedInEmail();

        UserEntity user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found"
                        )
                );


        // Update name
        if (request.getName() != null &&
                !request.getName().isBlank()) {

            user.setName(request.getName());
        }


        // Update saved address
        if (request.getAddress() != null) {

            user.setAddress(
                    request.getAddress()
            );
        }


        // Update password
        if (request.getPassword() != null &&
                !request.getPassword().isBlank()) {

            user.setPassword(
                    passwordEncoder.encode(
                            request.getPassword()
                    )
            );
        }


        UserEntity updatedUser =
                userRepository.save(user);

        return convertToResponse(updatedUser);
    }


    // =========================================================
    // UPLOAD PROFILE IMAGE
    // =========================================================

    @Override
    public UserResponse uploadProfileImage(
            MultipartFile file
    ) throws IOException {

        if (file == null || file.isEmpty()) {

            throw new IllegalArgumentException(
                    "Please select an image"
            );
        }

        if (file.getContentType() == null ||
                !file.getContentType().startsWith("image/")) {

            throw new IllegalArgumentException(
                    "Only image files are allowed"
            );
        }

        if (file.getSize() > 5 * 1024 * 1024) {

            throw new IllegalArgumentException(
                    "Image must be less than 5 MB"
            );
        }

        String email = getLoggedInEmail();

        UserEntity user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found"
                        )
                );

        String oldImageUrl =
                user.getProfileImageUrl();


        String newImageUrl =
                s3Service.uploadProfileImage(
                        file.getBytes(),
                        file.getOriginalFilename()
                );


        user.setProfileImageUrl(newImageUrl);

        UserEntity updatedUser =
                userRepository.save(user);


        if (oldImageUrl != null &&
                !oldImageUrl.isBlank()) {

            try {

                s3Service.deleteProfileImage(
                        oldImageUrl
                );

            } catch (Exception e) {

                System.out.println(
                        "Old profile image could not be deleted: "
                                + e.getMessage()
                );
            }
        }

        return convertToResponse(updatedUser);
    }


    // =========================================================
    // DELETE PROFILE IMAGE
    // =========================================================

    @Override
    public UserResponse deleteProfileImage()
            throws IOException {

        String email = getLoggedInEmail();

        UserEntity user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found"
                        )
                );

        String imageUrl =
                user.getProfileImageUrl();


        if (imageUrl != null &&
                !imageUrl.isBlank()) {

            s3Service.deleteProfileImage(
                    imageUrl
            );
        }


        user.setProfileImageUrl(null);

        UserEntity updatedUser =
                userRepository.save(user);

        return convertToResponse(updatedUser);
    }


    // =========================================================
    // GET LOGGED-IN EMAIL
    // =========================================================

    private String getLoggedInEmail() {

        if (authenticationFacade.getAuthentication() == null) {

            throw new UsernameNotFoundException(
                    "User is not authenticated"
            );
        }

        String email =
                authenticationFacade
                        .getAuthentication()
                        .getName();

        if (email == null || email.isBlank()) {

            throw new UsernameNotFoundException(
                    "User email not found"
            );
        }

        return email;
    }


    // =========================================================
    // ENTITY -> RESPONSE
    // =========================================================

    private UserResponse convertToResponse(
            UserEntity user
    ) {

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .address(user.getAddress())
                .profileImageUrl(
                        user.getProfileImageUrl()
                )
                .build();
    }
}