package com.FoodDeliveryApp.foodiesapi.service;

import com.FoodDeliveryApp.foodiesapi.entity.FoodEntity;
import com.FoodDeliveryApp.foodiesapi.io.FoodRequest;
import com.FoodDeliveryApp.foodiesapi.io.FoodResponse;
import com.FoodDeliveryApp.foodiesapi.repository.FoodRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FoodServiceImpl implements FoodService {
@Autowired
    private S3Client s3Client;
@Autowired
    private  FoodRepository foodRepository;

    @Value("${aws.s3.bucketname}")
    private String bucketName;

//    public String uploadFile(MultipartFile file) {
//        String filenameExtension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")+1);
//        String key = UUID.randomUUID().toString()+"."+filenameExtension;
//        try {
//            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
//                    .bucket(bucketName)
//                    .key(key)
////                    .acl("public-read")
//                    .contentType(file.getContentType())
////                    .contentDisposition("inline")
//                    .build();
//            PutObjectResponse response = s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
//
//            if (response.sdkHttpResponse().isSuccessful()) {
////                return "https://"+bucketName+".s3.amazonaws.com/"+key;
//                GetObjectRequest getObjectRequest =
//                        GetObjectRequest.builder()
//                                .bucket(bucketName)
//                                .key(key)
//                                .responseContentType(file.getContentType())
//                                .responseContentDisposition("inline")
//                                .build();
//
//
//                GetObjectPresignRequest presignRequest =
//                        GetObjectPresignRequest.builder()
//                                .signatureDuration(Duration.ofMinutes(60))
//                                .getObjectRequest(getObjectRequest)
//                                .build();
//
//
//                return s3Presigner.presignGetObject(presignRequest)
//                        .url()
//                        .toString();
//            } else {
//                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File upload failed");
//            }
//        }catch (IOException ex) {
//            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occured while uploading the file");
//        }
//    }
    @Override
    public String uploadFile(MultipartFile file) {

        String filenameExtension =
                file.getOriginalFilename()
                        .substring(file.getOriginalFilename().lastIndexOf(".")+1);

        String key = UUID.randomUUID() + "." + filenameExtension;

        try {

            PutObjectRequest putObjectRequest =
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .contentType("image/" + filenameExtension)
                            .build();


            s3Client.putObject(
                    putObjectRequest,
                    RequestBody.fromBytes(file.getBytes())
            );


            GetObjectRequest getObjectRequest =
                    GetObjectRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .responseContentType("image/" + filenameExtension)
                            .responseContentDisposition("inline")
                            .build();


            GetObjectPresignRequest presignRequest =
                    GetObjectPresignRequest.builder()
                            .getObjectRequest(getObjectRequest)
                            .signatureDuration(Duration.ofHours(1))
                            .build();


            return "https://"+bucketName+".s3.amazonaws.com/"+key;


        } catch(IOException e) {

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Upload failed"
            );
        }
    }
    @Override
    public FoodResponse addFood(FoodRequest request, MultipartFile file) {
        FoodEntity newFoodEntity = convertToEntity(request);
        String imageUrl = uploadFile(file);
        newFoodEntity.setImageUrl(imageUrl);
        newFoodEntity = foodRepository.save(newFoodEntity);
        return convertToResponse(newFoodEntity);
    }

    @Override
    public List<FoodResponse> readFoods() {
        List<FoodEntity> databaseEntries = foodRepository.findAll();
//        System.out.println("Mongo data= " +databaseEntries);
        return databaseEntries.stream().map(object -> convertToResponse(object)).collect(Collectors.toList());
    }

    @Override

    public FoodResponse readFood(String id) {
        FoodEntity existingFood = foodRepository.findById(id).orElseThrow(() -> new RuntimeException("Food not found for the id:"+id));
        return convertToResponse(existingFood);
    }

    @Override
    public boolean deleteFile(String filename) {
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(filename)
                .build();
        s3Client.deleteObject(deleteObjectRequest);
        return true;
    }

    @Override
    public void deleteFood(String id) {
        FoodResponse response = readFood(id);
        String imageUrl = response.getImageUrl();
        String filename = imageUrl.substring(imageUrl.lastIndexOf("/")+1);
        boolean isFileDelete = deleteFile(filename);
        if (isFileDelete) {
            foodRepository.deleteById(response.getId());
        }
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
