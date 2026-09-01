
        package com.FoodDeliveryApp.foodiesapi.config;
import com.FoodDeliveryApp.foodiesapi.filters.JwtAuthenticationFilter;
import com.FoodDeliveryApp.foodiesapi.service.AppUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AppUserDetailsService appUserDetailsService;
    // =========================================================
    // PASSWORD ENCODER
    // =========================================================
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    // =========================================================
    // AUTHENTICATION PROVIDER
    // =========================================================
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider();
        provider.setUserDetailsService(
                appUserDetailsService
        );
        provider.setPasswordEncoder(
                passwordEncoder()
        );
        return provider;
    }
    // =========================================================
    // AUTHENTICATION MANAGER
    // =========================================================
    @Bean
    public AuthenticationManager authenticationManager() {
        return new ProviderManager(
                authenticationProvider()
        );
    }
    // =========================================================
    // CORS
    // =========================================================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration =
                new CorsConfiguration();
        configuration.setAllowedOriginPatterns(
                Arrays.asList(
                        "http://localhost:*",
                        "http://127.0.0.1:*",
                        "https://*.netlify.app"
                )
        );
        configuration.setAllowedMethods(
                Arrays.asList(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );
        configuration.setAllowedHeaders(
                Arrays.asList(
                        "Authorization",
                        "Content-Type",
                        "Accept",
                        "Origin",
                        "X-Requested-With"
                )
        );
        configuration.setExposedHeaders(
                Arrays.asList(
                        "Authorization"
                )
        );
        configuration.setAllowCredentials(false);
        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration(
                "/**",
                configuration
        );
        return source;
    }
    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {
        http
                // =================================================
                // CORS
                // =================================================
                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )
                // =================================================
                // CSRF
                // =================================================
                .csrf(csrf ->
                        csrf.disable()
                )
                // =================================================
                // STATELESS
                // =================================================
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )
                // =================================================
                // AUTHORIZATION
                // =================================================
                .authorizeHttpRequests(auth -> {
                    // =================================================
                    // PUBLIC USER AUTH APIs
                    // =================================================
                    auth.requestMatchers(
                            "/api/login",
                            "/api/register"
                    ).permitAll();
                    // =================================================
                    // PUBLIC ADMIN LOGIN
                    // =================================================
                    auth.requestMatchers(
                            "/api/admin/login"
                    ).permitAll();
                    // =================================================
                    // PUBLIC FOOD GET
                    // =================================================
                    auth.requestMatchers(
                            HttpMethod.GET,
                            "/api/foods",
                            "/api/foods/**"
                    ).permitAll();
                    // =================================================
                    // CHEFBOT
                    // =================================================
                    auth.requestMatchers(
                            "/api/agent/**"
                    ).permitAll();
                    // =================================================
                    // ADMIN PANEL - FOOD
                    // =================================================
                    //
                    // Food list is public.
                    //
                    // Add/delete food remain ADMIN protected.
                    //
                    // =================================================
                    auth.requestMatchers(
                            HttpMethod.POST,
                            "/api/foods",
                            "/api/foods/**"
                    ).hasRole("ADMIN");
                    auth.requestMatchers(
                            HttpMethod.PUT,
                            "/api/foods",
                            "/api/foods/**"
                    ).hasRole("ADMIN");
                    auth.requestMatchers(
                            HttpMethod.PATCH,
                            "/api/foods",
                            "/api/foods/**"
                    ).hasRole("ADMIN");
                    auth.requestMatchers(
                            HttpMethod.DELETE,
                            "/api/foods",
                            "/api/foods/**"
                    ).hasRole("ADMIN");
                    // =================================================
                    // ADMIN PANEL - ALL ORDERS
                    // =================================================
                    //
                    // IMPORTANT:
                    //
                    // Admin panel is currently being used WITHOUT
                    // admin login.
                    //
                    // Therefore these endpoints are PUBLIC.
                    //
                    // =================================================
                    auth.requestMatchers(
                            HttpMethod.GET,
                            "/api/orders/all"
                    ).permitAll();
                    // =================================================
                    // ADMIN PANEL - UPDATE ORDER STATUS
                    // =================================================
                    //
                    // Admin panel currently does not send admin JWT.
                    //
                    // Therefore this is also public.
                    //
                    // =================================================
                    auth.requestMatchers(
                            HttpMethod.PATCH,
                            "/api/orders/status/**"
                    ).permitAll();
                    // =================================================
                    // NORMAL USER CART
                    // =================================================
                    auth.requestMatchers(
                            "/api/cart",
                            "/api/cart/**"
                    ).authenticated();
                    // =================================================
                    // NORMAL USER ORDERS
                    // =================================================
                    auth.requestMatchers(
                            "/api/orders/create",
                            "/api/orders/verify",
                            "/api/orders/*"
                    ).authenticated();
                    // =================================================
                    // USER PROFILE
                    // =================================================
                    auth.requestMatchers(
                            "/api/profile/**",
                            "/api/user/**"
                    ).authenticated();
                    // =================================================
                    // EVERYTHING ELSE
                    // =================================================
                    auth.anyRequest().authenticated();
                })
                // =================================================
                // JWT FILTER
                // =================================================
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );
        return http.build();
    }
}
