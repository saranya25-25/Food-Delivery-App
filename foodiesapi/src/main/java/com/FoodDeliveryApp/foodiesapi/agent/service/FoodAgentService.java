package com.FoodDeliveryApp.foodiesapi.agent.service;
import com.FoodDeliveryApp.foodiesapi.agent.dto.AgentRequest;
import com.FoodDeliveryApp.foodiesapi.agent.dto.AgentResponse;
import com.FoodDeliveryApp.foodiesapi.entity.FoodEntity;
import com.FoodDeliveryApp.foodiesapi.repository.FoodRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
public class FoodAgentService {
    private final FoodRepository foodRepository;
    private final ChatClient chatClient;
    public FoodAgentService(
            FoodRepository foodRepository,
            ChatClient.Builder chatClientBuilder
    ) {
        this.foodRepository = foodRepository;
        this.chatClient = chatClientBuilder.build();
    }
    // =========================================================
    // MAIN PROCESSOR
    // =========================================================
    public AgentResponse processStep(AgentRequest request) {
        if (request == null) {
            return getMainMenuResponse();
        }
        String action = request.getAction();
        if (action == null || action.isBlank()) {
            action = "SELECT_OPTION";
        }
        action = action.trim().toUpperCase();
        String selected = request.getSelectedValue();
        // =====================================================
        // BACK TO MAIN MENU
        // =====================================================
        if (isBackToMainMenu(selected)) {
            return getMainMenuResponse();
        }
        // =====================================================
        // BACK TO CATEGORIES
        // =====================================================
        if (isBackToCategories(selected)) {
            return getCategoryResponse();
        }
        // =====================================================
        // ACTION SWITCH
        // =====================================================
        switch (action) {
            // =================================================
            // MAIN MENU
            // =================================================
            case "START":
            case "SELECT_OPTION":
                if (equalsIgnoreCase(
                        selected,
                        "Order Food"
                )) {
                    return getCategoryResponse();
                }
                if (equalsIgnoreCase(
                        selected,
                        "Item Preparation"
                )) {
                    return getPreparationItemsResponse();
                }
                return getMainMenuResponse();
            // =================================================
            // CATEGORY
            // =================================================
            case "SELECT_CATEGORY":
                return handleCategorySelection(
                        selected
                );
            // =================================================
            // FOOD ITEM
            // =================================================
            case "PLACE_ORDER":
                return handleFoodOrderSelection(
                        selected,
                        request
                );
            // =================================================
            // PREPARATION
            // =================================================
            case "PREPARE_ITEM":
                return handlePreparationSelection(
                        selected
                );
            // =================================================
            // RECIPE COMPLETE
            // =================================================
            case "PREPARE_ITEM_DONE":
                return getPreparationItemsResponse();
            // =================================================
            // ADD TO CART
            // =================================================
            case "ADD_TO_CART":
                return new AgentResponse(
                        "🛒 Please continue to checkout.",
                        "ADD_TO_CART",
                        request.getCategory(),
                        request.getSelectedValue(),
                        List.of(
                                "Continue to Checkout",
                                "⬅ Back to Main Menu"
                        ),
                        null
                );
            default:
                return getMainMenuResponse();
        }
    }
    // =========================================================
    // CATEGORY RESPONSE
    // =========================================================
    private AgentResponse getCategoryResponse() {
        List<FoodEntity> foods =
                foodRepository.findAll();
        if (foods == null || foods.isEmpty()) {
            return new AgentResponse(
                    "❌ No food categories are available.",
                    "SELECT_OPTION",
                    null,
                    null,
                    List.of(
                            "Order Food",
                            "Item Preparation"
                    ),
                    null
            );
        }
        List<String> categories =
                foods.stream()
                        .filter(Objects::nonNull)
                        .map(FoodEntity::getCategory)
                        .filter(Objects::nonNull)
                        .map(String::trim)
                        .filter(
                                category ->
                                        !category.isBlank()
                        )
                        .distinct()
                        .sorted()
                        .collect(Collectors.toList());
        List<String> options =
                new ArrayList<>(categories);
        options.add(
                0,
                "⬅ Back to Main Menu"
        );
        return new AgentResponse(
                "🍽️ Select a food category:",
                "SELECT_CATEGORY",
                null,
                null,
                options,
                null
        );
    }
    // =========================================================
    // CATEGORY SELECTION
    // =========================================================
    private AgentResponse handleCategorySelection(
            String selected
    ) {
        if (
                selected == null
                        ||
                        selected.isBlank()
        ) {
            return getCategoryResponse();
        }
        List<FoodEntity> categoryItems =
                foodRepository.findByCategoryIgnoreCase(
                        selected.trim()
                );
        if (
                categoryItems == null
                        ||
                        categoryItems.isEmpty()
        ) {
            return new AgentResponse(
                    "❌ No food items found in "
                            + selected
                            + ".",
                    "SELECT_CATEGORY",
                    null,
                    null,
                    List.of(
                            "⬅ Back to Main Menu"
                    ),
                    null
            );
        }
        List<String> itemDisplayList =
                categoryItems.stream()
                        .filter(Objects::nonNull)
                        .filter(
                                food ->
                                        food.getName() != null
                        )
                        .map(
                                food ->
                                        food.getName()
                                                + " - ₹"
                                                + food.getPrice()
                        )
                        .distinct()
                        .collect(Collectors.toList());
        itemDisplayList.add(
                0,
                "⬅ Back to Categories"
        );
        return new AgentResponse(
                "🍽️ Select an item from "
                        + selected
                        + ":",
                "PLACE_ORDER",
                selected,
                null,
                itemDisplayList,
                null
        );
    }
    // =========================================================
    // FOOD ITEM SELECTION
    // =========================================================
    private AgentResponse handleFoodOrderSelection(
            String selected,
            AgentRequest request
    ) {
        if (
                selected == null
                        ||
                        selected.isBlank()
        ) {
            return new AgentResponse(
                    "❌ Please select a food item.",
                    "PLACE_ORDER",
                    request.getCategory(),
                    null,
                    List.of(
                            "⬅ Back to Categories"
                    ),
                    null
            );
        }
        String itemName =
                cleanFoodName(selected);
        if (itemName.isBlank()) {
            return new AgentResponse(
                    "❌ Please select a valid food item.",
                    "PLACE_ORDER",
                    request.getCategory(),
                    null,
                    List.of(
                            "⬅ Back to Categories"
                    ),
                    null
            );
        }
        Optional<FoodEntity> matchedFood =
                foodRepository.findAll()
                        .stream()
                        .filter(Objects::nonNull)
                        .filter(
                                food ->
                                        food.getName() != null
                        )
                        .filter(
                                food ->
                                        food.getName()
                                                .trim()
                                                .equalsIgnoreCase(
                                                        itemName
                                                )
                        )
                        .findFirst();
        if (matchedFood.isEmpty()) {
            return new AgentResponse(
                    "❌ Food item '"
                            + itemName
                            + "' was not found.",
                    "PLACE_ORDER",
                    request.getCategory(),
                    null,
                    List.of(
                            "⬅ Back to Categories"
                    ),
                    null
            );
        }
        FoodEntity food =
                matchedFood.get();
        String foodId =
                food.getId();
        if (
                foodId == null
                        ||
                        foodId.isBlank()
        ) {
            return new AgentResponse(
                    "❌ Food ID is missing for "
                            + food.getName()
                            + ".",
                    "PLACE_ORDER",
                    request.getCategory(),
                    null,
                    List.of(
                            "⬅ Back to Categories"
                    ),
                    null
            );
        }
        return new AgentResponse(
                "🛒 "
                        + food.getName()
                        + " selected for ₹"
                        + food.getPrice()
                        + ".",
                "ADD_TO_CART",
                request.getCategory(),
                foodId,
                List.of(
                        "Continue to Checkout",
                        "⬅ Back to Main Menu"
                ),
                null
        );
    }
    // =========================================================
    // PREPARATION ITEMS
    // =========================================================
    private AgentResponse getPreparationItemsResponse() {
        List<FoodEntity> foods =
                foodRepository.findAll();
        if (
                foods == null
                        ||
                        foods.isEmpty()
        ) {
            return new AgentResponse(
                    "❌ No food items are available.",
                    "PREPARE_ITEM",
                    null,
                    null,
                    List.of(
                            "⬅ Back to Main Menu"
                    ),
                    null
            );
        }
        List<String> items =
                foods.stream()
                        .filter(Objects::nonNull)
                        .map(FoodEntity::getName)
                        .filter(Objects::nonNull)
                        .map(String::trim)
                        .filter(
                                item ->
                                        !item.isBlank()
                        )
                        .distinct()
                        .sorted()
                        .collect(Collectors.toList());
        List<String> options =
                new ArrayList<>(items);
        options.add(
                0,
                "⬅ Back to Main Menu"
        );
        return new AgentResponse(
                "👨‍🍳 Which item's recipe would you like?",
                "PREPARE_ITEM",
                null,
                null,
                options,
                null
        );
    }
    // =========================================================
    // PREPARATION SELECTION
    // =========================================================
    private AgentResponse handlePreparationSelection(
            String selected
    ) {
        if (
                selected == null
                        ||
                        selected.isBlank()
        ) {
            return getPreparationItemsResponse();
        }
        String dishName =
                cleanFoodName(selected);
        Optional<FoodEntity> matchedFood =
                foodRepository.findAll()
                        .stream()
                        .filter(Objects::nonNull)
                        .filter(
                                food ->
                                        food.getName() != null
                        )
                        .filter(
                                food ->
                                        food.getName()
                                                .trim()
                                                .equalsIgnoreCase(
                                                        dishName
                                                )
                        )
                        .findFirst();
        if (matchedFood.isEmpty()) {
            return new AgentResponse(
                    "❌ I couldn't find '"
                            + dishName
                            + "' in our menu.",
                    "PREPARE_ITEM",
                    null,
                    null,
                    List.of(
                            "⬅ Back to Main Menu"
                    ),
                    null
            );
        }
        String actualDishName =
                matchedFood
                        .get()
                        .getName();
        // =====================================================
        // AI RECIPE GENERATION
        // =====================================================
        String recipe =
                generateRecipe(actualDishName);
        return new AgentResponse(
                "👨‍🍳 Here is the complete recipe for "
                        + actualDishName
                        + ":",
                "PREPARE_ITEM_DONE",
                null,
                null,
                List.of(
                        "⬅ Back to Main Menu",
                        "⬅ Back to Item Preparation"
                ),
                List.of(recipe)
        );
    }
    // =========================================================
    // MAIN MENU
    // =========================================================
    private AgentResponse getMainMenuResponse() {
        return new AgentResponse(
                "🍗 Hi! I am ChefBot. How can I assist you?",
                "SELECT_OPTION",
                null,
                null,
                List.of(
                        "Order Food",
                        "Item Preparation"
                ),
                null
        );
    }
    // =========================================================
    // AI RECIPE GENERATION
    // =========================================================
    private String generateRecipe(
            String dishName
    ) {
        if (
                dishName == null
                        ||
                        dishName.isBlank()
        ) {
            return "❌ Sorry, I couldn't identify the dish.";
        }
        String prompt = """
                You are ChefBot, a professional chef.
                Generate a complete practical home-cooking recipe
                specifically for:
                %s
                IMPORTANT:
                The recipe must be specific to "%s".
                Do not use a generic recipe template.
                Use simple English.
                Format the response exactly using these sections:
                🍽️ RECIPE: %s
                🧂 INGREDIENTS
                List all ingredients with realistic quantities.
                👨‍🍳 STEP-BY-STEP PREPARATION
                Give detailed numbered steps.
                Include:
                - preparation
                - washing if necessary
                - cutting
                - marination if necessary
                - heating
                - cooking
                - frying/boiling/roasting/sauteing when appropriate
                - cooking times
                - heat level where useful
                - signs that the food is properly cooked
                - final serving
                ⏱️ COOKING TIME
                Preparation time:
                Cooking time:
                Total time:
                👥 SERVINGS
                Mention approximate servings.
                💪 APPROXIMATE NUTRITION PER SERVING
                Calories:
                Protein:
                Fat:
                Carbohydrates:
                Clearly state that nutrition values are approximate.
                💡 CHEF'S TIPS
                Give 3-5 useful tips specifically for this dish.
                RULES:
                1. Do not mention AI.
                2. Do not invent restaurant information.
                3. Do not give vague instructions.
                4. Do not say "cook until done" without explaining
                   how to identify when it is done.
                5. Do not unnecessarily shorten the recipe.
                6. Make it practical for home cooking.
                7. Keep the recipe specific to the requested dish.
                """.formatted(
                dishName,
                dishName,
                dishName
        );
        try {
            System.out.println(
                    "========================================"
            );
            System.out.println(
                    "CHEFBOT RECIPE REQUEST"
            );
            System.out.println(
                    "Dish: " + dishName
            );
            System.out.println(
                    "========================================"
            );
            String response =
                    chatClient
                            .prompt()
                            .user(prompt)
                            .call()
                            .content();
            if (
                    response != null
                            &&
                            !response.isBlank()
            ) {
                System.out.println(
                        "✅ ChefBot recipe generated successfully"
                );
                return response.trim();
            }
        } catch (Exception e) {
            System.err.println(
                    "========================================"
            );
            System.err.println(
                    "❌ CHEFBOT RECIPE GENERATION FAILED"
            );
            System.err.println(
                    "Dish: " + dishName
            );
            System.err.println(
                    "Error: " + e.getMessage()
            );
            System.err.println(
                    "========================================"
            );
            e.printStackTrace();
        }
        return """
                ❌ ChefBot could not generate this recipe right now.
                Please check the ChefBot AI configuration and try again.
                """;
    }
    // =========================================================
    // CLEAN FOOD NAME
    // =========================================================
    private String cleanFoodName(
            String selected
    ) {
        if (selected == null) {
            return "";
        }
        String cleaned =
                selected.trim();
        if (cleaned.contains(" - ")) {
            cleaned =
                    cleaned
                            .split(" - ", 2)[0]
                            .trim();
        }
        return cleaned;
    }
    // =========================================================
    // BACK TO MAIN MENU
    // =========================================================
    private boolean isBackToMainMenu(
            String selected
    ) {
        return selected != null
                &&
                selected.trim()
                        .equalsIgnoreCase(
                                "⬅ Back to Main Menu"
                        );
    }
    // =========================================================
    // BACK TO CATEGORIES
    // =========================================================
    private boolean isBackToCategories(
            String selected
    ) {
        return selected != null
                &&
                selected.trim()
                        .equalsIgnoreCase(
                                "⬅ Back to Categories"
                        );
    }
    // =========================================================
    // STRING COMPARISON
    // =========================================================
    private boolean equalsIgnoreCase(
            String first,
            String second
    ) {
        return first != null
                &&
                second != null
                &&
                first.trim()
                        .equalsIgnoreCase(
                                second.trim()
                        );
    }
}