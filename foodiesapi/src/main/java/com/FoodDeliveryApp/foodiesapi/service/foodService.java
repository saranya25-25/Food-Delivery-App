package com.FoodDeliveryApp.foodiesapi.service;

import org.springframework.web.multipart.MultipartFile;

public interface foodService {
    String uploadFile(MultipartFile file);
}
