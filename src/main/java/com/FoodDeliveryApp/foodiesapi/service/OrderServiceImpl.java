
        package com.FoodDeliveryApp.foodiesapi.service;
import com.FoodDeliveryApp.foodiesapi.entity.OrderEntity;
import com.FoodDeliveryApp.foodiesapi.io.OrderRequest;
import com.FoodDeliveryApp.foodiesapi.io.OrderResponse;
import com.FoodDeliveryApp.foodiesapi.repository.OrderRepository;
import com.FoodDeliveryApp.foodiesapi.repository.CartRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;
@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private CartRepository cartRespository;
    @Value("${razorpay.key.id}")
    private String RAZORPAY_KEY;
    @Value("${razorpay.key.secret}")
    private String RAZORPAY_SECRET;
    // =========================================================
    // INDIA TIMEZONE
    // =========================================================
    private static final ZoneId INDIA_ZONE =
            ZoneId.of("Asia/Kolkata");
    /*
     * Always get current time in India.
     *
     * This is important because Docker/Render servers
     * commonly run using UTC.
     *
     * LocalDateTime.now()
     *        ↓
     * Server timezone
     *
     * indiaNow()
     *        ↓
     * Asia/Kolkata
     *        ↓
     * IST
     */
    private LocalDateTime indiaNow() {
        return LocalDateTime.now(
                INDIA_ZONE
        );
    }
    // =========================================================
    // CREATE ORDER + RAZORPAY
    // =========================================================
    @Override
    public OrderResponse createOrderWithPayment(
            OrderRequest request
    ) throws RazorpayException {
        // =====================================================
        // SAVE ADDRESS TO USER PROFILE
        // =====================================================
        if (
                request.getUserAddress() != null
                        &&
                        !request.getUserAddress().isBlank()
        ) {
            userService.updateProfile(
                    com.FoodDeliveryApp.foodiesapi.io.UserRequest
                            .builder()
                            .address(request.getUserAddress())
                            .build()
            );
        }
        // =====================================================
        // CREATE ORDER ENTITY
        // =====================================================
        /*
         * IMPORTANT:
         *
         * Do NOT use:
         *
         * LocalDateTime.now()
         *
         * because the deployed Docker/Render server may use UTC.
         *
         * Use India time explicitly.
         */
        LocalDateTime now =
                indiaNow();
        /*
         * Estimated delivery:
         * 30 minutes after order placement.
         */
        LocalDateTime estimatedDelivery =
                now.plusMinutes(30);
        OrderEntity newOrder =
                convertToEntity(
                        request,
                        now,
                        estimatedDelivery
                );
        // =====================================================
        // FIND LOGGED-IN USER
        // =====================================================
        String loggedInUserId =
                userService.findByUserId();
        newOrder.setUserId(
                loggedInUserId
        );
        // =====================================================
        // SAVE INITIAL ORDER
        // =====================================================
        newOrder =
                orderRepository.save(
                        newOrder
                );
        // =====================================================
        // CREATE RAZORPAY ORDER
        // =====================================================
        RazorpayClient razorpayClient =
                new RazorpayClient(
                        RAZORPAY_KEY,
                        RAZORPAY_SECRET
                );
        JSONObject orderRequest =
                new JSONObject();
        orderRequest.put(
                "amount",
                (int) (
                        newOrder.getAmount()
                                * 100
                )
        );
        orderRequest.put(
                "currency",
                "INR"
        );
        orderRequest.put(
                "payment_capture",
                1
        );
        Order razorpayOrder =
                razorpayClient.orders.create(
                        orderRequest
                );
        // =====================================================
        // SAVE RAZORPAY ORDER ID
        // =====================================================
        newOrder.setRazorpayOrderId(
                razorpayOrder.get("id")
        );
        newOrder =
                orderRepository.save(
                        newOrder
                );
        return convertToResponse(
                newOrder
        );
    }
    // =========================================================
    // VERIFY PAYMENT
    // =========================================================
    @Override
    public void verifyPayment(
            Map<String, String> paymentData,
            String status
    ) {
        String razorpayOrderId =
                paymentData.get(
                        "razorpay_order_id"
                );
        OrderEntity existingOrder =
                orderRepository
                        .findByRazorpayOrderId(
                                razorpayOrderId
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Order not found"
                                )
                        );
        existingOrder.setPaymentStatus(
                status
        );
        existingOrder.setRazorpaySignature(
                paymentData.get(
                        "razorpay_signature"
                )
        );
        existingOrder.setRazorpayPaymentId(
                paymentData.get(
                        "razorpay_payment_id"
                )
        );
        // =====================================================
        // PAYMENT SUCCESS
        // =====================================================
        if (
                "paid".equalsIgnoreCase(
                        status
                )
        ) {
            existingOrder.setOrderStatus(
                    "Confirmed"
            );
            /*
             * Save confirmation time in IST.
             */
            if (
                    existingOrder.getConfirmedAt()
                            == null
            ) {
                existingOrder.setConfirmedAt(
                        indiaNow()
                );
            }
        }
        // =====================================================
        // SAVE ORDER
        // =====================================================
        orderRepository.save(
                existingOrder
        );
        // =====================================================
        // CLEAR CART
        // =====================================================
        if (
                "paid".equalsIgnoreCase(
                        status
                )
        ) {
            cartRespository.deleteByUserId(
                    existingOrder.getUserId()
            );
        }
    }
    // =========================================================
    // GET LOGGED-IN USER ORDERS
    // =========================================================
    @Override
    public List<OrderResponse> getUserOrders() {
        String loggedInUserId =
                userService.findByUserId();
        List<OrderEntity> list =
                orderRepository.findByUserId(
                        loggedInUserId
                );
        return list.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    // =========================================================
    // GET ONE ORDER
    // =========================================================
    @Override
    public OrderResponse getOrderById(
            String orderId
    ) {
        String loggedInUserId =
                userService.findByUserId();
        OrderEntity order =
                orderRepository
                        .findById(orderId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Order not found"
                                )
                        );
        // =====================================================
        // SECURITY
        // =====================================================
        if (
                !loggedInUserId.equals(
                        order.getUserId()
                )
        ) {
            throw new RuntimeException(
                    "You are not authorized to view this order"
            );
        }
        return convertToResponse(
                order
        );
    }
    // =========================================================
    // DELETE ORDER
    // =========================================================
    @Override
    public void removeOrder(
            String orderId
    ) {
        orderRepository.deleteById(
                orderId
        );
    }
    // =========================================================
    // ADMIN - GET ALL ORDERS
    // =========================================================
    @Override
    public List<OrderResponse> getOrdersOfAllUsers() {
        List<OrderEntity> list =
                orderRepository.findAll();
        return list.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    // =========================================================
    // ADMIN - UPDATE ORDER STATUS
    // =========================================================
    @Override
    public void updateOrderStatus(
            String orderId,
            String status
    ) {
        OrderEntity entity =
                orderRepository
                        .findById(orderId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Order not found"
                                )
                        );
        // =====================================================
        // NORMALIZE STATUS
        // =====================================================
        String normalizedStatus =
                normalizeStatus(status);
        entity.setOrderStatus(
                normalizedStatus
        );
        // =====================================================
        // SAVE STATUS TIMESTAMP
        // =====================================================
        /*
         * IMPORTANT:
         *
         * Use India time here as well.
         */
        LocalDateTime now =
                indiaNow();
        switch (normalizedStatus) {
            // =================================================
            // CONFIRMED
            // =================================================
            case "Confirmed":
                if (
                        entity.getConfirmedAt()
                                == null
                ) {
                    entity.setConfirmedAt(
                            now
                    );
                }
                break;
            // =================================================
            // PREPARING
            // =================================================
            case "Preparing":
                if (
                        entity.getPreparingAt()
                                == null
                ) {
                    entity.setPreparingAt(
                            now
                    );
                }
                break;
            // =================================================
            // OUT FOR DELIVERY
            // =================================================
            case "Out for Delivery":
                if (
                        entity.getOutForDeliveryAt()
                                == null
                ) {
                    entity.setOutForDeliveryAt(
                            now
                    );
                }
                break;
            // =================================================
            // DELIVERED
            // =================================================
            case "Delivered":
                if (
                        entity.getDeliveredAt()
                                == null
                ) {
                    entity.setDeliveredAt(
                            now
                    );
                }
                break;
            default:
                break;
        }
        // =====================================================
        // SAVE
        // =====================================================
        orderRepository.save(
                entity
        );
    }
    // =========================================================
    // NORMALIZE STATUS
    // =========================================================
    private String normalizeStatus(
            String status
    ) {
        if (status == null) {
            return "Confirmed";
        }
        String value =
                status.trim()
                        .toLowerCase();
        switch (value) {
            case "confirmed":
                return "Confirmed";
            case "preparing":
                return "Preparing";
            /*
             * Frontend currently uses:
             *
             * Food Preparing
             *
             * Support it here.
             */
            case "food preparing":
                return "Preparing";
            case "out for delivery":
                return "Out for Delivery";
            case "out-for-delivery":
                return "Out for Delivery";
            case "outfordelivery":
                return "Out for Delivery";
            case "delivered":
                return "Delivered";
            default:
                return status.trim();
        }
    }
    // =========================================================
    // AI AGENT SUPPORT
    // =========================================================
    @Override
    public Map<String, Object>
    addItemsToCartAndPrepareCheckout(
            List<Map<String, Object>> items
    ) {
        double totalAmount =
                0.0;
        List<Map<String, Object>>
                processedItems =
                new ArrayList<>();
        for (
                Map<String, Object> item
                : items
        ) {
            String name =
                    (String) item.getOrDefault(
                            "itemName",
                            "Food Item"
                    );
            int quantity =
                    (
                            (Number)
                                    item.getOrDefault(
                                            "quantity",
                                            1
                                    )
                    ).intValue();
            double price =
                    name.toLowerCase()
                            .contains("biryani")
                            ? 350.0
                            : 200.0;
            double itemTotal =
                    price * quantity;
            totalAmount +=
                    itemTotal;
            Map<String, Object>
                    itemDetails =
                    new HashMap<>();
            itemDetails.put(
                    "itemName",
                    name
            );
            itemDetails.put(
                    "quantity",
                    quantity
            );
            itemDetails.put(
                    "price",
                    price
            );
            itemDetails.put(
                    "total",
                    itemTotal
            );
            processedItems.add(
                    itemDetails
            );
        }
        // =====================================================
        // RESPONSE
        // =====================================================
        Map<String, Object>
                response =
                new HashMap<>();
        response.put(
                "success",
                true
        );
        response.put(
                "message",
                "Items added to cart successfully!"
        );
        response.put(
                "totalAmount",
                totalAmount
        );
        response.put(
                "items",
                processedItems
        );
        response.put(
                "checkoutUrl",
                "/cart"
        );
        response.put(
                "action",
                "REDIRECT_TO_CHECKOUT"
        );
        return response;
    }
    // =========================================================
    // CONVERT ENTITY -> RESPONSE
    // =========================================================
    private OrderResponse convertToResponse(
            OrderEntity newOrder
    ) {
        return OrderResponse.builder()
                // =================================================
                // BASIC ORDER INFORMATION
                // =================================================
                .id(
                        newOrder.getId()
                )
                .amount(
                        newOrder.getAmount()
                )
                .userAddress(
                        newOrder.getUserAddress()
                )
                .userId(
                        newOrder.getUserId()
                )
                .razorpayOrderId(
                        newOrder.getRazorpayOrderId()
                )
                .paymentStatus(
                        newOrder.getPaymentStatus()
                )
                .orderStatus(
                        newOrder.getOrderStatus()
                )
                .email(
                        newOrder.getEmail()
                )
                .phoneNumber(
                        newOrder.getPhoneNumber()
                )
                .orderedItems(
                        newOrder.getOrderedItems()
                )
                // =================================================
                // ORDER TRACKING
                // =================================================
                .orderPlacedAt(
                        newOrder.getOrderPlacedAt()
                )
                .estimatedDeliveryTime(
                        newOrder.getEstimatedDeliveryTime()
                )
                .confirmedAt(
                        newOrder.getConfirmedAt()
                )
                .preparingAt(
                        newOrder.getPreparingAt()
                )
                .outForDeliveryAt(
                        newOrder.getOutForDeliveryAt()
                )
                .deliveredAt(
                        newOrder.getDeliveredAt()
                )
                .build();
    }
    // =========================================================
    // CONVERT REQUEST -> ENTITY
    // =========================================================
    private OrderEntity convertToEntity(
            OrderRequest request,
            LocalDateTime orderPlacedAt,
            LocalDateTime estimatedDeliveryTime
    ) {
        return OrderEntity.builder()
                // =================================================
                // ORDER INFORMATION
                // =================================================
                .userAddress(
                        request.getUserAddress()
                )
                .amount(
                        request.getAmount()
                )
                .orderedItems(
                        request.getOrderedItems()
                )
                .email(
                        request.getEmail()
                )
                .phoneNumber(
                        request.getPhoneNumber()
                )
                // =================================================
                // INITIAL STATUS
                // =================================================
                .orderStatus(
                        "Pending"
                )
                .paymentStatus(
                        "Pending"
                )
                // =================================================
                // TRACKING TIMES
                // =================================================
                /*
                 * Order placed time is IST.
                 */
                .orderPlacedAt(
                        orderPlacedAt
                )
                /*
                 * Estimated delivery is 30 minutes
                 * after order placement.
                 */
                .estimatedDeliveryTime(
                        estimatedDeliveryTime
                )
                /*
                 * Confirmation time initially equals
                 * order placement time.
                 *
                 * After successful payment this remains
                 * unless it has not already been set.
                 */
                .confirmedAt(
                        orderPlacedAt
                )
                .build();
    }
}
