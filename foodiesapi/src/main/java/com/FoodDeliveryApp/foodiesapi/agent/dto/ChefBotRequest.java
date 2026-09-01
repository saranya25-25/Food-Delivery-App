package com.FoodDeliveryApp.foodiesapi.agent.dto;
public class ChefBotRequest {
    private String message;
    public ChefBotRequest() {}
    public ChefBotRequest(String message) {
        this.message = message;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
}