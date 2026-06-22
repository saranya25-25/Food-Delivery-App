package com.FoodDeliveryApp.foodiesapi.service;

import com.FoodDeliveryApp.foodiesapi.entity.FoodEntity;
import com.FoodDeliveryApp.foodiesapi.io.FoodRequest;
import com.FoodDeliveryApp.foodiesapi.io.FoodResponse;
import com.FoodDeliveryApp.foodiesapi.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.IOException;
import java.util.UUID;

@Service
public class FoodServiceImp implements FoodService {

    private final S3Client s3Client;
    private final FoodRepository foodRepository;

    @Value("${aws.s3.bucketname}")
    private String bucketName;

    public FoodServiceImp(S3Client s3Client,
                          FoodRepository foodRepository) {
        this.s3Client = s3Client;
        this.foodRepository = foodRepository;
    }

    @Override
    public String uploadFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "File is empty"
            );
        }

        String originalFileName = file.getOriginalFilename();

        if (originalFileName == null || originalFileName.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid file name"
            );
        }

        int dotIndex = originalFileName.lastIndexOf(".");

        if (dotIndex == -1) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid file type"
            );
        }

        String extension = originalFileName.substring(dotIndex + 1);

        String key = UUID.randomUUID() + "." + extension;

        try {

            PutObjectRequest putObjectRequest =
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .contentType(file.getContentType())
                            .build();

            PutObjectResponse response =
                    s3Client.putObject(
                            putObjectRequest,
                            RequestBody.fromBytes(file.getBytes())
                    );

            if (!response.sdkHttpResponse().isSuccessful()) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "File upload failed"
                );
            }

            return "https://" +
                    bucketName +
                    ".s3.amazonaws.com/" +
                    key;

        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error uploading file",
                    e
            );
        }
    }

    @Override
    public FoodResponse addFood(FoodRequest request,
                                MultipartFile file) {

        FoodEntity foodEntity = convertToEntity(request);

        String imageUrl = uploadFile(file);

        foodEntity.setImageUrl(imageUrl);

        FoodEntity savedFood =
                foodRepository.save(foodEntity);

        return convertToResponse(savedFood);
    }

    private FoodEntity convertToEntity(FoodRequest request) {

        return FoodEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .build();
    }

    private FoodResponse convertToResponse(FoodEntity entity) {

        return FoodResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .category(entity.getCategory())
                .price(entity.getPrice())
                .imageUrl(entity.getImageUrl())
                .build();
    }
}