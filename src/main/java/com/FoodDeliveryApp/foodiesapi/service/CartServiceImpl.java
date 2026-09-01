package com.FoodDeliveryApp.foodiesapi.service;
import com.FoodDeliveryApp.foodiesapi.entity.CartEntity;
import com.FoodDeliveryApp.foodiesapi.io.CartRequest;
import com.FoodDeliveryApp.foodiesapi.io.CartResponse;
import com.FoodDeliveryApp.foodiesapi.repository.CartRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
@Service
@AllArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final UserService userService;
    // =========================================================
    // ADD TO CART
    // =========================================================
    @Override
    public CartResponse addToCart(CartRequest request) {
        if (request == null ||
                request.getFoodId() == null ||
                request.getFoodId().isBlank()) {
            throw new RuntimeException("Food ID is required");
        }
        String loggedInUserId = userService.findByUserId();
        if (loggedInUserId == null || loggedInUserId.isBlank()) {
            throw new RuntimeException("User is not authenticated");
        }
        CartEntity cart = cartRepository
                .findByUserId(loggedInUserId)
                .orElseGet(() ->
                        new CartEntity(
                                loggedInUserId,
                                new HashMap<>()
                        )
                );
        if (cart.getItems() == null) {
            cart.setItems(new HashMap<>());
        }
        Map<String, Integer> cartItems = cart.getItems();
        String foodId = request.getFoodId().trim();
        int currentQuantity =
                cartItems.getOrDefault(foodId, 0);
        cartItems.put(
                foodId,
                currentQuantity + 1
        );
        cart.setItems(cartItems);
        CartEntity savedCart =
                cartRepository.save(cart);
        System.out.println(
                "========================================"
        );
        System.out.println(
                "CHEFBOT/CART - ITEM ADDED"
        );
        System.out.println(
                "User ID: " + loggedInUserId
        );
        System.out.println(
                "Food ID: " + foodId
        );
        System.out.println(
                "Quantity: " + cartItems.get(foodId)
        );
        System.out.println(
                "Cart ID: " + savedCart.getId()
        );
        System.out.println(
                "Cart Items: " + savedCart.getItems()
        );
        System.out.println(
                "========================================"
        );
        return convertToResponse(savedCart);
    }
    // =========================================================
    // GET CART
    // =========================================================
    @Override
    public CartResponse getCart() {
        String loggedInUserId =
                userService.findByUserId();
        if (loggedInUserId == null ||
                loggedInUserId.isBlank()) {
            throw new RuntimeException(
                    "User is not authenticated"
            );
        }
        CartEntity cart =
                cartRepository
                        .findByUserId(loggedInUserId)
                        .orElseGet(() ->
                                new CartEntity(
                                        null,
                                        loggedInUserId,
                                        new HashMap<>()
                                )
                        );
        System.out.println(
                "========================================"
        );
        System.out.println(
                "GET CART"
        );
        System.out.println(
                "User ID: " + loggedInUserId
        );
        System.out.println(
                "Cart ID: " + cart.getId()
        );
        System.out.println(
                "Cart Items: " + cart.getItems()
        );
        System.out.println(
                "========================================"
        );
        return convertToResponse(cart);
    }
    // =========================================================
    // CLEAR CART
    // =========================================================
    @Override
    public void clearCart() {
        String loggedInUserId =
                userService.findByUserId();
        if (loggedInUserId == null ||
                loggedInUserId.isBlank()) {
            throw new RuntimeException(
                    "User is not authenticated"
            );
        }
        cartRepository.deleteByUserId(
                loggedInUserId
        );
    }
    // =========================================================
    // REMOVE FROM CART
    // =========================================================
    @Override
    public CartResponse removeFromCart(
            CartRequest cartRequest
    ) {
        if (cartRequest == null ||
                cartRequest.getFoodId() == null ||
                cartRequest.getFoodId().isBlank()) {
            throw new RuntimeException(
                    "Food ID is required"
            );
        }
        String loggedInUserId =
                userService.findByUserId();
        CartEntity cart =
                cartRepository
                        .findByUserId(loggedInUserId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cart is not found"
                                )
                        );
        if (cart.getItems() == null) {
            cart.setItems(new HashMap<>());
        }
        Map<String, Integer> cartItems =
                cart.getItems();
        String foodId =
                cartRequest.getFoodId().trim();
        if (cartItems.containsKey(foodId)) {
            int currentQuantity =
                    cartItems.get(foodId);
            if (currentQuantity > 1) {
                cartItems.put(
                        foodId,
                        currentQuantity - 1
                );
            } else {
                // IMPORTANT:
                // Remove item completely when quantity reaches 0.
                cartItems.remove(foodId);
            }
            cart.setItems(cartItems);
            cart =
                    cartRepository.save(cart);
        }
        return convertToResponse(cart);
    }
    // =========================================================
    // CONVERT ENTITY → RESPONSE
    // =========================================================
    private CartResponse convertToResponse(
            CartEntity cartEntity
    ) {
        if (cartEntity == null) {
            return CartResponse.builder()
                    .id(null)
                    .userId(null)
                    .items(new HashMap<>())
                    .build();
        }
        Map<String, Integer> items =
                cartEntity.getItems();
        if (items == null) {
            items = new HashMap<>();
        }
        return CartResponse.builder()
                .id(cartEntity.getId())
                .userId(cartEntity.getUserId())
                .items(items)
                .build();
    }
}