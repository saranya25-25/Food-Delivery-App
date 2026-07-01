package com.FoodDeliveryApp.foodiesapi.service;

import com.FoodDeliveryApp.foodiesapi.io.CartRequest;
import com.FoodDeliveryApp.foodiesapi.io.CartResponse;

public interface CartService {
    CartResponse addToCart(CartRequest request);

    CartResponse getCart();

    void clearCart();

    CartResponse removeFromCart(CartRequest cartRequest);
}
