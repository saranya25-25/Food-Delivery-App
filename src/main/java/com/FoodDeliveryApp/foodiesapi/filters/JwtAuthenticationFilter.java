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
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {


        // =====================================================
        // PUBLIC FOOD API
        // =====================================================

        String path = request.getRequestURI();

        if (path.equals("/api/foods") ||
                path.startsWith("/api/foods/")) {

            filterChain.doFilter(request, response);
            return;
        }


        // =====================================================
        // GET AUTHORIZATION HEADER
        // =====================================================

        String authHeader =
                request.getHeader("Authorization");

        String token = null;
        String username = null;


        // =====================================================
        // CHECK BEARER TOKEN
        // =====================================================

        if (authHeader != null &&
                authHeader.startsWith("Bearer ")) {

            token = authHeader.substring(7);

            try {

                username =
                        jwtUtil.extractUsername(token);

            } catch (ExpiredJwtException e) {

                System.out.println(
                        "JWT token expired"
                );

                // Clear authentication
                SecurityContextHolder
                        .clearContext();

                // Continue request.
                // Spring Security will decide whether
                // authentication is required.

                filterChain.doFilter(
                        request,
                        response
                );

                return;

            } catch (Exception e) {

                System.out.println(
                        "Invalid JWT token: "
                                + e.getMessage()
                );

                SecurityContextHolder
                        .clearContext();

                // Continue request.

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }
        }


        // =====================================================
        // AUTHENTICATE USER
        // =====================================================

        if (username != null &&
                SecurityContextHolder
                        .getContext()
                        .getAuthentication() == null) {

            try {

                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(
                                        username
                                );


                // =================================================
                // VALIDATE TOKEN
                // =================================================

                if (jwtUtil.validateToken(
                        token,
                        userDetails
                )) {

                    UsernamePasswordAuthenticationToken
                            authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );


                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );


                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authentication
                            );
                }

            } catch (ExpiredJwtException e) {

                System.out.println(
                        "JWT token expired"
                );

                SecurityContextHolder
                        .clearContext();

            } catch (Exception e) {

                System.out.println(
                        "JWT authentication failed: "
                                + e.getMessage()
                );

                SecurityContextHolder
                        .clearContext();
            }
        }


        // =====================================================
        // CONTINUE REQUEST
        // =====================================================

        filterChain.doFilter(
                request,
                response
        );
    }
}