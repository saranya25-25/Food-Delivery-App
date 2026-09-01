package com.FoodDeliveryApp.foodiesapi.agent.controller;
import com.FoodDeliveryApp.foodiesapi.agent.dto.AgentRequest;
import com.FoodDeliveryApp.foodiesapi.agent.dto.AgentResponse;
import com.FoodDeliveryApp.foodiesapi.agent.service.FoodAgentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/agent")
@CrossOrigin(origins = "http://localhost:5173") // Adjust if your React app runs on a different port
public class FoodAgentController {
    private final FoodAgentService foodAgentService;
    public FoodAgentController(FoodAgentService foodAgentService) {
        this.foodAgentService = foodAgentService;
    }
    @PostMapping("/step")
    public ResponseEntity<AgentResponse> processStep(@RequestBody AgentRequest request) {
        try {
            AgentResponse response = foodAgentService.processStep(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Print stack trace to your backend terminal so you can see any underlying database or AI errors
            e.printStackTrace();
            // Return a safe fallback response with HTTP 200 OK to prevent frontend connection errors
            AgentResponse errorResponse = new AgentResponse(
                    "⚠️ Sorry, ChefBot encountered an issue. Please try again!",
                    "SELECT_OPTION",
                    null,
                    null,
                    List.of("Order Food", "Item Preparation"),
                    null
            );
            return ResponseEntity.status(HttpStatus.OK).body(errorResponse);
        }
    }
}