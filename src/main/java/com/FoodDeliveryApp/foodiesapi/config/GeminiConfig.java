package com.FoodDeliveryApp.foodiesapi.config;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
public class GeminiConfig {
    // =========================================================
    // GEMINI API KEY
    // =========================================================
    @Value("${spring.ai.openai.api-key}")
    private String apiKey;
    // =========================================================
    // OPENAI-COMPATIBLE GEMINI API
    // =========================================================
    @Bean
    public OpenAiApi openAiApi() {
        return OpenAiApi.builder()
                .baseUrl(
                        "https://generativelanguage.googleapis.com/v1beta/openai"
                )
                .apiKey(apiKey)
                .build();
    }
    // =========================================================
    // GEMINI CHAT MODEL
    // =========================================================
    @Bean
    public OpenAiChatModel openAiChatModel(
            OpenAiApi openAiApi
    ) {
        OpenAiChatOptions options =
                OpenAiChatOptions.builder()
                        .model("gemini-3.6-flash")
                        .temperature(0.7)
                        .build();
        return OpenAiChatModel.builder()
                .openAiApi(openAiApi)
                .defaultOptions(options)
                .build();
    }
}