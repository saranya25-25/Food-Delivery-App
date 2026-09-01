package com.FoodDeliveryApp.foodiesapi.agent.dto;
public class ChefBotResponse {
    private String reply;
    public ChefBotResponse() {}
    public ChefBotResponse(String reply) {
        this.reply = reply;
    }
    public String getReply() {
        return reply;
    }
    public void setReply(String reply) {
        this.reply = reply;
    }
}