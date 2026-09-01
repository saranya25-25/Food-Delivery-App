package com.FoodDeliveryApp.foodiesapi.config;
import com.razorpay.RazorpayClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
public class RazorpayConfig {
    @Value("${RAZORPAY_KEY}")
    private String keyId;
    @Value("${RAZORPAY_SECRET}")
    private String keySecret;
    @Bean
    public RazorpayClient razorpayClient() throws Exception {
        return new RazorpayClient(keyId, keySecret);
    }
}