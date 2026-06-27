package com.FoodDeliveryApp.foodiesapi.service;

import com.FoodDeliveryApp.foodiesapi.io.FoodRequest;
import com.FoodDeliveryApp.foodiesapi.io.FoodResponse;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
public interface FoodService {
    String uploadFile(MultipartFile file);
      FoodResponse addFood(FoodRequest request, MultipartFile file);
    List<FoodResponse> readFoods();
    FoodResponse readFood(String id);
    boolean deleteFile(String filename);
    void deleteFood(String id);

}
