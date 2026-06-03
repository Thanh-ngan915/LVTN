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
                .cors(cors -> cors.disable())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/stores/{storeId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/vouchers/store/{storeId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/vouchers/{voucherId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/vouchers").permitAll()
                        .requestMatchers("/api/stores/has-store").authenticated()
                        .requestMatchers("/api/stores/register").authenticated()
                        .requestMatchers("/api/stores/my-store").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/stores/{storeId}").permitAll()
                        .requestMatchers("/api/stores/**").authenticated()
                        .requestMatchers("/api/vouchers/**").authenticated()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}