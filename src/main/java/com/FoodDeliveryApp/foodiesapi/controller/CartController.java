package com.FoodDeliveryApp.foodiesapi.controller;
import com.FoodDeliveryApp.foodiesapi.io.CartRequest;
import com.FoodDeliveryApp.foodiesapi.io.CartResponse;
import com.FoodDeliveryApp.foodiesapi.service.CartService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/cart")
@AllArgsConstructor
public class CartController {
    private final CartService cartService;
    @PostMapping
    public CartResponse addToCart(
            @RequestBody CartRequest request
    ) {
        return cartService.addToCart(request);
    }
    @GetMapping
    public CartResponse getCart() {
        return cartService.getCart();
    }
    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart() {
        cartService.clearCart();
    }
    @PostMapping("/remove")
    public CartResponse removeFromCart(
            @RequestBody CartRequest request
    ) {
        return cartService.removeFromCart(request);
    }
}