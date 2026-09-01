package com.FoodDeliveryApp.foodiesapi.entity;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Document(collection = "foods")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FoodEntity {
    @Id
    private String id;
    private String name;
    private String description;
    private String category;
    private String subCategory; // Added subCategory field
    private double price;
    private String imageUrl;
    // If NOT using Lombok, explicitly define getters and setters:
    public String getSubCategory() {
        return subCategory;
    }
    public void setSubCategory(String subCategory) {
        this.subCategory = subCategory;
    }
}