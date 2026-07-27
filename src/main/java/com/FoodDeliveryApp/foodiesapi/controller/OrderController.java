package com.FoodDeliveryApp.foodiesapi.controller;

import com.FoodDeliveryApp.foodiesapi.io.OrderRequest;
import com.FoodDeliveryApp.foodiesapi.io.OrderResponse;
import com.FoodDeliveryApp.foodiesapi.service.OrderService;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    /**
     * Create Order and Razorpay Payment
     */
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrderWithPayment(
            @RequestBody OrderRequest request)
            throws RazorpayException {

        return orderService.createOrderWithPayment(request);
    }

    /**
     * Verify Razorpay Payment
     */
    @PostMapping("/verify")
    @ResponseStatus(HttpStatus.OK)
    public void verifyPayment(
            @RequestBody Map<String, String> paymentData) {

        orderService.verifyPayment(paymentData, "Paid");
    }

    /**
     * Logged-in User Orders
     */
    @GetMapping
    public List<OrderResponse> getOrders() {
        return orderService.getUserOrders();
    }

    /**
     * Delete Order
     */
    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(
            @PathVariable String orderId) {

        orderService.removeOrder(orderId);
    }

    /**
     * Admin - Get All Orders
     */
    @GetMapping("/all")
    public List<OrderResponse> getOrdersOfAllUsers() {
        return orderService.getOrdersOfAllUsers();
    }

    /**
     * Admin - Update Order Status
     */
    @PatchMapping("/status/{orderId}")
    @ResponseStatus(HttpStatus.OK)
    public void updateOrderStatus(
            @PathVariable String orderId,
            @RequestParam String status) {

        orderService.updateOrderStatus(orderId, status);
    }
}