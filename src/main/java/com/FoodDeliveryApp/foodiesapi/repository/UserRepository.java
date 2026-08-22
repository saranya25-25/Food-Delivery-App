package com.FoodDeliveryApp.foodiesapi.repository;

import com.FoodDeliveryApp.foodiesapi.entity.UserEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository
        extends MongoRepository<UserEntity, String> {

    Optional<UserEntity> findByEmail(String email);
}