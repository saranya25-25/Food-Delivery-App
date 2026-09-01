package com.FoodDeliveryApp.foodiesapi.io;
import lombok.Builder;
import lombok.Data;
import java.util.List;
@Data
@Builder
public class OrderRequest {
    private List<OrderItem> orderedItems;
    private String userAddress;
    private double amount;
    private String email;
    private String phoneNumber;
    /*
     * We are keeping this field so your
     * existing frontend/backend structure
     * does not break.
     *
     * Backend will control the actual status.
     */
    private String orderStatus;
}