package com.FoodDeliveryApp.foodiesapi.agent.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgentRequest {
    private String action;
    private String selectedValue;
    private String category;
    private String subCategory;
    private String message;
    private String foodId;
}