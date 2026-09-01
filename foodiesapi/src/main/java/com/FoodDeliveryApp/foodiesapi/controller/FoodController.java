package com.FoodDeliveryApp.foodiesapi.controller;
import com.FoodDeliveryApp.foodiesapi.io.FoodRequest;
import com.FoodDeliveryApp.foodiesapi.io.FoodResponse;
import com.FoodDeliveryApp.foodiesapi.service.FoodService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FoodController {
    private final FoodService foodService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    // =========================================================
    // ADD FOOD
    // =========================================================
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FoodResponse addFood(
            @RequestPart("food") String foodString,
            @RequestPart("file") MultipartFile file
    ) {
        try {
            FoodRequest request =
                    objectMapper.readValue(
                            foodString,
                            FoodRequest.class
                    );
            return foodService.addFood(
                    request,
                    file
            );
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid food JSON format."
            );
        }
    }
    // =========================================================
    // GET ALL FOODS
    // =========================================================
    @GetMapping
    public List<FoodResponse> readFoods() {
        return foodService.readFoods();
    }
    // =========================================================
    // GET FOOD BY ID
    // =========================================================
    @GetMapping("/{id}")
    public FoodResponse readFood(
            @PathVariable String id
    ) {
        return foodService.readFood(id);
    }
    // =========================================================
    // DELETE FOOD
    // =========================================================
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFood(
            @PathVariable String id
    ) {
        foodService.deleteFood(id);
    }
}