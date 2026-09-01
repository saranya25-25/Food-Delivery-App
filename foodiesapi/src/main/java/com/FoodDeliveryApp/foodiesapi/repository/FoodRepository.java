package com.FoodDeliveryApp.foodiesapi.repository;
import com.FoodDeliveryApp.foodiesapi.entity.FoodEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface FoodRepository extends MongoRepository<FoodEntity, String> {
    // Fetch distinct values programmatically via MongoTemplate or service,
    // or use custom Mongo Queries:
    // Find all items by category (case-insensitive)
    List<FoodEntity> findByCategoryIgnoreCase(String category);
    // Find all items by category and subCategory (case-insensitive)
    List<FoodEntity> findByCategoryIgnoreCaseAndSubCategoryIgnoreCase(String category, String subCategory);
    // Search food item by name (case-insensitive partial match)
    List<FoodEntity> findByNameContainingIgnoreCase(String name);
}