package com.FoodDeliveryApp.foodiesapi.service;
import com.FoodDeliveryApp.foodiesapi.io.FoodFeedbackRequest;
import com.FoodDeliveryApp.foodiesapi.io.FoodFeedbackResponse;
public interface FoodFeedbackService {
    FoodFeedbackResponse saveFeedback(
            FoodFeedbackRequest request
    );
    FoodFeedbackResponse getFeedback(
            String foodId
    );
    void deleteFeedback(
            String foodId
    );
}