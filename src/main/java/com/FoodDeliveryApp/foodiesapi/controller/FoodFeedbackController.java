package com.FoodDeliveryApp.foodiesapi.controller;

import com.FoodDeliveryApp.foodiesapi.io.FoodFeedbackRequest;
import com.FoodDeliveryApp.foodiesapi.io.FoodFeedbackResponse;
import com.FoodDeliveryApp.foodiesapi.service.FoodFeedbackService;

import lombok.AllArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/food-feedback")
public class FoodFeedbackController {


    private final FoodFeedbackService feedbackService;


    // =========================================================
    // SAVE / UPDATE RATING + FAVORITE
    // =========================================================

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public FoodFeedbackResponse saveFeedback(
            @RequestBody FoodFeedbackRequest request
    ) {

        return feedbackService.saveFeedback(
                request
        );
    }


    // =========================================================
    // GET FEEDBACK FOR FOOD
    // =========================================================

    @GetMapping("/{foodId}")
    public FoodFeedbackResponse getFeedback(
            @PathVariable String foodId
    ) {

        return feedbackService.getFeedback(
                foodId
        );
    }


    // =========================================================
    // DELETE FEEDBACK
    // =========================================================

    @DeleteMapping("/{foodId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFeedback(
            @PathVariable String foodId
    ) {

        feedbackService.deleteFeedback(
                foodId
        );
    }
}