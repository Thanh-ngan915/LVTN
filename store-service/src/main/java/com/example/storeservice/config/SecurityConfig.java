package com.example.storeservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenFilter jwtTokenFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Public endpoints - không cần auth
                        .requestMatchers(HttpMethod.GET, "/api/stores/promotions/active").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/stores/{storeId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/stores").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/vouchers/store/{storeId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/vouchers/{voucherId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/vouchers").permitAll()
                        .requestMatchers(HttpMethod.PATCH, "/api/stores/**").authenticated()
                        .requestMatchers("/api/stores/has-store").authenticated()
                        .requestMatchers("/api/stores/register").authenticated()
                        .requestMatchers("/api/stores/my-store").authenticated()
                        .requestMatchers("/api/stores/**").authenticated()
                        .requestMatchers("/api/vouchers/**").authenticated()
                        .requestMatchers("/api/wallet/store/**").permitAll()
                        .requestMatchers("/api/wallet/**").authenticated()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "X-Store-Id", "X-User-Id"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}