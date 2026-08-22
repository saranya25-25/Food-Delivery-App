package com.FoodDeliveryApp.foodiesapi.service;

import com.FoodDeliveryApp.foodiesapi.entity.FoodFeedbackEntity;
import com.FoodDeliveryApp.foodiesapi.io.FoodFeedbackRequest;
import com.FoodDeliveryApp.foodiesapi.io.FoodFeedbackResponse;
import com.FoodDeliveryApp.foodiesapi.repository.FoodFeedbackRepository;

import lombok.AllArgsConstructor;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class FoodFeedbackServiceImpl
        implements FoodFeedbackService {

    private final FoodFeedbackRepository feedbackRepository;

    private final UserService userService;

    @Override
    public FoodFeedbackResponse saveFeedback(
            FoodFeedbackRequest request
    ) {

        if (request.getFoodId() == null ||
                request.getFoodId().isBlank()) {

            throw new IllegalArgumentException(
                    "Food ID is required"
            );
        }

        if (request.getRating() < 0 ||
                request.getRating() > 5) {

            throw new IllegalArgumentException(
                    "Rating must be between 0 and 5"
            );
        }

        String userId =
                userService.findByUserId();

        FoodFeedbackEntity feedback =
                feedbackRepository
                        .findByUserIdAndFoodId(
                                userId,
                                request.getFoodId()
                        )
                        .orElse(
                                FoodFeedbackEntity.builder()
                                        .userId(userId)
                                        .foodId(request.getFoodId())
                                        .build()
                        );

        feedback.setRating(
                request.getRating()
        );

        feedback.setFavorite(
                request.isFavorite()
        );

        feedback.setUpdatedAt(
                LocalDateTime.now()
        );

        FoodFeedbackEntity saved =
                feedbackRepository.save(feedback);

        return convertToResponse(saved);
    }


    @Override
    public FoodFeedbackResponse getFeedback(
            String foodId
    ) {

        String userId =
                userService.findByUserId();

        FoodFeedbackEntity feedback =
                feedbackRepository
                        .findByUserIdAndFoodId(
                                userId,
                                foodId
                        )
                        .orElse(null);

        if (feedback == null) {

            return FoodFeedbackResponse.builder()
                    .foodId(foodId)
                    .rating(0)
                    .favorite(false)
                    .build();
        }

        return convertToResponse(feedback);
    }


    @Override
    public void deleteFeedback(
            String foodId
    ) {

        String userId =
                userService.findByUserId();

        feedbackRepository
                .findByUserIdAndFoodId(
                        userId,
                        foodId
                )
                .ifPresent(
                        feedbackRepository::delete
                );
    }


    private FoodFeedbackResponse convertToResponse(
            FoodFeedbackEntity entity
    ) {

        return FoodFeedbackResponse.builder()
                .foodId(entity.getFoodId())
                .rating(entity.getRating())
                .favorite(entity.isFavorite())
                .build();
    }
}