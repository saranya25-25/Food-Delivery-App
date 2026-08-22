package com.FoodDeliveryApp.foodiesapi.filters;

import com.FoodDeliveryApp.foodiesapi.util.JwtUtil;
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

import io.jsonwebtoken.ExpiredJwtException;

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

        String authHeader =
                request.getHeader("Authorization");

        String token = null;
        String username = null;


        // ==========================================
        // CHECK AUTHORIZATION HEADER
        // ==========================================

        if (authHeader != null &&
                authHeader.startsWith("Bearer ")) {

            token =
                    authHeader.substring(7);

            try {

                username =
                        jwtUtil.extractUsername(token);

            } catch (ExpiredJwtException e) {

                System.out.println(
                        "JWT token expired"
                );

                response.setStatus(
                        HttpServletResponse.SC_UNAUTHORIZED
                );

                response.setContentType(
                        "application/json"
                );

                response.getWriter().write(
                        "{\"message\":\"JWT token expired\"}"
                );

                return;

            } catch (Exception e) {

                System.out.println(
                        "Invalid JWT token: "
                                + e.getMessage()
                );

                response.setStatus(
                        HttpServletResponse.SC_UNAUTHORIZED
                );

                response.setContentType(
                        "application/json"
                );

                response.getWriter().write(
                        "{\"message\":\"Invalid JWT token\"}"
                );

                return;
            }
        }


        // ==========================================
        // AUTHENTICATE USER
        // ==========================================

        if (username != null &&
                SecurityContextHolder
                        .getContext()
                        .getAuthentication() == null) {

            UserDetails userDetails =
                    userDetailsService
                            .loadUserByUsername(username);

            try {

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

                response.setStatus(
                        HttpServletResponse.SC_UNAUTHORIZED
                );

                return;

            } catch (Exception e) {

                response.setStatus(
                        HttpServletResponse.SC_UNAUTHORIZED
                );

                return;
            }
        }


        filterChain.doFilter(
                request,
                response
        );
    }
}