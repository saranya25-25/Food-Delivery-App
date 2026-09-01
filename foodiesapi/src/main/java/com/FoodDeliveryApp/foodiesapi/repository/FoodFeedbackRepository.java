package com.FoodDeliveryApp.foodiesapi.repository;
import com.FoodDeliveryApp.foodiesapi.entity.FoodFeedbackEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
public interface FoodFeedbackRepository
        extends MongoRepository<FoodFeedbackEntity, String> {
    Optional<FoodFeedbackEntity> findByUserIdAndFoodId(
            String userId,
            String foodId
    );
}