package com.FoodDeliveryApp.foodiesapi.controller;

import com.FoodDeliveryApp.foodiesapi.io.FoodRequest;
import com.FoodDeliveryApp.foodiesapi.io.FoodResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.FoodDeliveryApp.foodiesapi.service.FoodService;
@RestController
@RequestMapping("/api/foods")
@AllArgsConstructor
public class FoodController {
    private final FoodService foodService;
    @PostMapping
public FoodResponse addFood(@RequestPart("food") String foodString, @RequestPart("file")MultipartFile file){
    ObjectMapper objectMapper=new ObjectMapper();
    FoodRequest request=null;
    try{
        request=objectMapper.readValue(foodString,FoodRequest.class);
    }
    catch(JsonProcessingException ex){
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid JSON Format");

    }
    FoodResponse response=foodService.addFood(request,file);
return response;
    }


}
