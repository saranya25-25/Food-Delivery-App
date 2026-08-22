package com.FoodDeliveryApp.foodiesapi.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "food_feedback")
@CompoundIndex(
        name = "user_food_unique",
        def = "{'userId': 1, 'foodId': 1}",
        unique = true
)
public class FoodFeedbackEntity {

    @Id
    private String id;

    private String userId;

    private String foodId;

    private int rating;

    private boolean favorite;

    private LocalDateTime updatedAt;
}