package com.FoodDeliveryApp.foodiesapi.agent.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgentResponse {
    /*
     * Main message returned by ChefBot.
     *
     * Example:
     * "👨‍🍳 Here is the complete recipe for Chicken Biryani:"
     */
    private String reply;
    /*
     * Tells the React frontend what action should happen next.
     *
     * Examples:
     * SELECT_OPTION
     * SELECT_CATEGORY
     * PLACE_ORDER
     * ADD_TO_CART
     * PREPARE_ITEM
     * PREPARE_ITEM_DONE
     * CHAT
     */
    private String nextAction;
    /*
     * Selected food category.
     *
     * Example:
     * "Biryani"
     * "Starters"
     * "Desserts"
     */
    private String category;
    /*
     * Used in your current ordering flow to carry the MongoDB
     * food ID back to React.
     *
     * IMPORTANT:
     * In handleFoodOrderSelection(), you are putting:
     *
     *     food.getId()
     *
     * into this field.
     */
    private String subCategory;
    /*
     * Buttons/options displayed by the React ChefBot.
     *
     * Examples:
     *
     * [
     *     "Order Food",
     *     "Item Preparation"
     * ]
     *
     * or:
     *
     * [
     *     "Continue to Checkout",
     *     "⬅ Back to Main Menu"
     * ]
     */
    private List<String> options;
    /*
     * Recipe information.
     *
     * Your React frontend already checks:
     *
     * msg.recipeSteps
     *
     * and displays every item in this list.
     *
     * We are currently putting the COMPLETE AI-generated recipe
     * inside this list as one String.
     *
     * Example:
     *
     * [
     *     "🍽️ RECIPE: Chicken Biryani
     *
     *      🧂 INGREDIENTS
     *      ...
     *
     *      👨‍🍳 STEP-BY-STEP PREPARATION
     *      1. ...
     *      2. ...
     *
     *      💪 APPROXIMATE NUTRITION PER SERVING
     *      Protein: ...
     *      Fat: ...
     *      ..."
     * ]
     */
    private List<String> recipeSteps;
}