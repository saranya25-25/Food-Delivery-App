
        package com.FoodDeliveryApp.foodiesapi.filters;
import com.FoodDeliveryApp.foodiesapi.util.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
@Component
@AllArgsConstructor
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    // =========================================================
    // MAIN JWT FILTER
    // =========================================================
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        // =====================================================
        // 1. CORS PREFLIGHT
        // =====================================================
        if ("OPTIONS".equalsIgnoreCase(
                request.getMethod()
        )) {
            filterChain.doFilter(
                    request,
                    response
            );
            return;
        }
        // =====================================================
        // 2. REQUEST INFORMATION
        // =====================================================
        String path =
                request.getRequestURI();
        String method =
                request.getMethod();
        System.out.println(
                "================================================"
        );
        System.out.println(
                "JWT FILTER REQUEST: "
                        + method
                        + " "
                        + path
        );
        // =====================================================
        // 3. PUBLIC ENDPOINTS
        // =====================================================
        boolean publicEndpoint = false;
        // =====================================================
        // USER LOGIN
        // =====================================================
        if (path.equals("/api/login")) {
            publicEndpoint = true;
        }
        // =====================================================
        // USER REGISTER
        // =====================================================
        else if (path.equals("/api/register")) {
            publicEndpoint = true;
        }
        // =====================================================
        // ADMIN LOGIN
        // =====================================================
        else if (path.equals("/api/admin/login")) {
            publicEndpoint = true;
        }
        // =====================================================
        // PUBLIC FOOD APIs
        // =====================================================
        else if (
                (
                        method.equalsIgnoreCase("GET")
                                ||
                                method.equalsIgnoreCase("POST")
                                ||
                                method.equalsIgnoreCase("PUT")
                                ||
                                method.equalsIgnoreCase("PATCH")
                                ||
                                method.equalsIgnoreCase("DELETE")
                )
                        &&
                        (
                                path.equals("/api/foods")
                                        ||
                                        path.startsWith("/api/foods/")
                        )
        ) {
            publicEndpoint = true;
        }
        // =====================================================
        // CHEFBOT
        // =====================================================
        else if (
                path.startsWith("/api/agent/")
        ) {
            publicEndpoint = true;
        }
        // =====================================================
        // ADMIN - GET ALL ORDERS
        // =====================================================
        else if (
                method.equalsIgnoreCase("GET")
                        &&
                        path.equals("/api/orders/all")
        ) {
            publicEndpoint = true;
        }
        // =====================================================
        // ADMIN - UPDATE ORDER STATUS
        // =====================================================
        else if (
                method.equalsIgnoreCase("PATCH")
                        &&
                        path.startsWith("/api/orders/status/")
        ) {
            publicEndpoint = true;
        }
        // =====================================================
        // 4. SKIP JWT FOR PUBLIC ENDPOINT
        // =====================================================
        if (publicEndpoint) {
            System.out.println(
                    "JWT: PUBLIC ENDPOINT"
            );
            System.out.println(
                    "JWT: Skipping authentication for "
                            + method
                            + " "
                            + path
            );
            filterChain.doFilter(
                    request,
                    response
            );
            return;
        }
        // =====================================================
        // 5. GET AUTHORIZATION HEADER
        // =====================================================
        String authHeader =
                request.getHeader("Authorization");
        System.out.println(
                "Authorization header present: "
                        + (authHeader != null)
        );
        // =====================================================
        // 6. NO TOKEN
        // =====================================================
        if (
                authHeader == null
                        ||
                        !authHeader.startsWith("Bearer ")
        ) {
            System.out.println(
                    "JWT: No Bearer token for "
                            + method
                            + " "
                            + path
            );
            filterChain.doFilter(
                    request,
                    response
            );
            return;
        }
        // =====================================================
        // 7. EXTRACT TOKEN
        // =====================================================
        String token =
                authHeader.substring(7);
        if (token.isBlank()) {
            System.out.println(
                    "JWT: Empty Bearer token"
            );
            filterChain.doFilter(
                    request,
                    response
            );
            return;
        }
        // =====================================================
        // 8. PROCESS JWT
        // =====================================================
        try {
            String username =
                    jwtUtil.extractUsername(token);
            System.out.println(
                    "JWT username: "
                            + username
            );
            if (
                    username != null
                            &&
                            SecurityContextHolder
                                    .getContext()
                                    .getAuthentication()
                                    == null
            ) {
                // =============================================
                // LOAD USER
                // =============================================
                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(
                                        username
                                );
                System.out.println(
                        "JWT user loaded successfully: "
                                + username
                );
                // =============================================
                // VALIDATE TOKEN
                // =============================================
                boolean valid =
                        jwtUtil.validateToken(
                                token,
                                userDetails
                        );
                System.out.println(
                        "JWT valid: "
                                + valid
                );
                // =============================================
                // SET AUTHENTICATION
                // =============================================
                if (valid) {
                    UsernamePasswordAuthenticationToken
                            authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );
                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(
                                            request
                                    )
                    );
                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authentication
                            );
                    System.out.println(
                            "=========================================="
                    );
                    System.out.println(
                            "JWT AUTHENTICATION SUCCESS"
                    );
                    System.out.println(
                            "USER: "
                                    + username
                    );
                    System.out.println(
                            "AUTHORITIES: "
                                    + userDetails
                                    .getAuthorities()
                    );
                    System.out.println(
                            "PATH: "
                                    + path
                    );
                    System.out.println(
                            "=========================================="
                    );
                }
                else {
                    System.out.println(
                            "JWT: INVALID TOKEN"
                    );
                }
            }
        }
        // =====================================================
        // 9. EXPIRED TOKEN
        // =====================================================
        catch (ExpiredJwtException e) {
            System.out.println(
                    "JWT TOKEN EXPIRED"
            );
            SecurityContextHolder
                    .clearContext();
        }
        // =====================================================
        // 10. INVALID TOKEN / OTHER ERROR
        // =====================================================
        catch (Exception e) {
            System.out.println(
                    "JWT AUTHENTICATION FAILED: "
                            + e.getMessage()
            );
            SecurityContextHolder
                    .clearContext();
        }
        // =====================================================
        // 11. CONTINUE FILTER CHAIN
        // =====================================================
        filterChain.doFilter(
                request,
                response
        );
    }
}
