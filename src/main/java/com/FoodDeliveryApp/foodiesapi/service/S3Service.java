package com.FoodDeliveryApp.foodiesapi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;

    @Value("${aws.bucket.name}")
    private String bucketName;

    @Value("${aws.region}")
    private String region;

    // ==============================
    // UPLOAD IMAGE
    // ==============================

    public String uploadProfileImage(
            byte[] imageBytes,
            String contentType
    ) {

        String fileName =
                "profile-images/"
                        + UUID.randomUUID()
                        + ".jpg";

        PutObjectRequest putObjectRequest =
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fileName)
                        .contentType(contentType)
                        .build();

        s3Client.putObject(
                putObjectRequest,
                RequestBody.fromBytes(imageBytes)
        );

        return "https://"
                + bucketName
                + ".s3."
                + region
                + ".amazonaws.com/"
                + fileName;
    }

    // ==============================
    // DELETE IMAGE
    // ==============================

    public void deleteProfileImage(String imageUrl) {

        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }

        String prefix =
                "https://" + bucketName
                        + ".s3."
                        + region
                        + ".amazonaws.com/";

        if (!imageUrl.startsWith(prefix)) {
            return;
        }

        String key =
                imageUrl.substring(prefix.length());

        DeleteObjectRequest deleteObjectRequest =
                DeleteObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build();

        s3Client.deleteObject(deleteObjectRequest);
    }
}