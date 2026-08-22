package com.FoodDeliveryApp.foodiesapi.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FoodFeedbackRequest {

    private String foodId;

    private int rating;

    private boolean favorite;
}