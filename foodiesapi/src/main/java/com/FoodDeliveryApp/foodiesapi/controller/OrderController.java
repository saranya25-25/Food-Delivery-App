
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
    // =========================================================
    // CREATE ORDER
    // =========================================================
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrderWithPayment(
            @RequestBody OrderRequest request
    ) throws RazorpayException {
        return orderService.createOrderWithPayment(
                request
        );
    }
    // =========================================================
    // VERIFY PAYMENT
    // =========================================================
    @PostMapping("/verify")
    @ResponseStatus(HttpStatus.OK)
    public void verifyPayment(
            @RequestBody Map<String, String> paymentData
    ) {
        orderService.verifyPayment(
                paymentData,
                "Paid"
        );
    }
    // =========================================================
    // LOGGED-IN USER ORDERS
    // =========================================================
    @GetMapping
    public List<OrderResponse> getOrders() {
        return orderService.getUserOrders();
    }
    // =========================================================
    // GET SINGLE ORDER
    // =========================================================
    @GetMapping("/{orderId}")
    public OrderResponse getOrderById(
            @PathVariable String orderId
    ) {
        return orderService.getOrderById(
                orderId
        );
    }
    // =========================================================
    // DELETE USER ORDER
    // =========================================================
    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(
            @PathVariable String orderId
    ) {
        orderService.removeOrder(
                orderId
        );
    }
    // =========================================================
    // ADMIN PANEL
    // GET ALL USERS' ORDERS
    // =========================================================
    //
    // IMPORTANT:
    // This endpoint is intentionally PUBLIC.
    //
    // No admin JWT required.
    //
    // =========================================================
    @GetMapping("/all")
    public List<OrderResponse> getOrdersOfAllUsers() {
        System.out.println(
                "ADMIN PANEL: FETCHING ALL USER ORDERS"
        );
        return orderService.getOrdersOfAllUsers();
    }
    // =========================================================
    // ADMIN PANEL
    // UPDATE ORDER STATUS
    // =========================================================
    @PatchMapping("/status/{orderId}")
    @ResponseStatus(HttpStatus.OK)
    public void updateOrderStatus(
            @PathVariable String orderId,
            @RequestParam String status
    ) {
        System.out.println(
                "ADMIN PANEL: UPDATING ORDER STATUS"
        );
        System.out.println(
                "ORDER ID: " + orderId
        );
        System.out.println(
                "STATUS: " + status
        );
        orderService.updateOrderStatus(
                orderId,
                status
        );
    }
}
