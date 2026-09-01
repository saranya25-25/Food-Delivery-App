package com.FoodDeliveryApp.foodiesapi.service;
import com.FoodDeliveryApp.foodiesapi.io.OrderRequest;
import com.FoodDeliveryApp.foodiesapi.io.OrderResponse;
import com.razorpay.RazorpayException;
import java.util.List;
import java.util.Map;
public interface OrderService {
    OrderResponse createOrderWithPayment(
            OrderRequest request
    ) throws RazorpayException;
    void verifyPayment(
            Map<String, String> paymentData,
            String status
    );
    List<OrderResponse> getUserOrders();
    /*
     * Get one order for logged-in user.
     */
    OrderResponse getOrderById(
            String orderId
    );
    void removeOrder(
            String orderId
    );
    List<OrderResponse> getOrdersOfAllUsers();
    void updateOrderStatus(
            String orderId,
            String status
    );
    // AI Agent Support Method
    Map<String, Object> addItemsToCartAndPrepareCheckout(
            List<Map<String, Object>> items
    );
}