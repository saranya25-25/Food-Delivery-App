package com.FoodDeliveryApp.foodiesapi.service;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
@Service
public class OtpService {
    private final SecureRandom random = new SecureRandom();
    private final Map<String, OtpData> otpStorage =
            new ConcurrentHashMap<>();
    public String generateOtp(String phoneNumber) {
        String otp = String.format(
                "%06d",
                random.nextInt(1000000)
        );
        long expiryTime =
                System.currentTimeMillis()
                        + (5 * 60 * 1000);
        otpStorage.put(
                phoneNumber,
                new OtpData(otp, expiryTime)
        );
        return otp;
    }
    public boolean verifyOtp(
            String phoneNumber,
            String enteredOtp
    ) {
        OtpData otpData =
                otpStorage.get(phoneNumber);
        if (otpData == null) {
            return false;
        }
        if (System.currentTimeMillis()
                > otpData.expiryTime()) {
            otpStorage.remove(phoneNumber);
            return false;
        }
        if (!otpData.otp().equals(enteredOtp)) {
            return false;
        }
        otpStorage.remove(phoneNumber);
        return true;
    }
    public void removeOtp(String phoneNumber) {
        otpStorage.remove(phoneNumber);
    }
    private record OtpData(
            String otp,
            long expiryTime
    ) {
    }
}