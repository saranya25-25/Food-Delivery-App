package com.FoodDeliveryApp.foodiesapi.agent.tools;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;
import java.util.function.Function;
@Configuration
public class FoodAgentTools {
    public record PlaceOrderRequest(String foodItem, int quantity, String deliveryAddress) {}
    public record PlaceOrderResponse(String orderId, String status, String message) {}
    @Bean("placeFoodOrderTool")
    @Description("Places a food order given the item name, quantity, and delivery address.")
    public Function<PlaceOrderRequest, PlaceOrderResponse> placeFoodOrderTool() {
        return request -> {
            String orderId = "ORD-" + (System.currentTimeMillis() % 10000);
            String message = String.format("Successfully placed order for %d x %s.",
                    request.quantity(), request.foodItem());
            return new PlaceOrderResponse(orderId, "CONFIRMED", message);
        };
    }
}