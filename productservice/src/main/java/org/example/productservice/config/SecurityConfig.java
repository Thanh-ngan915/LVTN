package org.example.productservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenFilter jwtTokenFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/error").permitAll()
                        // Đọc sản phẩm: public
                        .requestMatchers(HttpMethod.GET,
                                "/api/products",
                                "/api/products/**",
                                "/api/categories",
                                "/api/categories/**",
                                "/api/cart/count")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/products/update-stock").permitAll()
                        // Admin
                        .requestMatchers(HttpMethod.PATCH,
                                "/api/products/*/approve",
                                "/api/products/*/reject",
                                "/api/products/*/hide")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/products/stats").hasRole("ADMIN")
                        // Giỏ hàng cần xác thực (trừ /count)
                        .requestMatchers("/api/cart/**").authenticated()
                        // Tạo/sửa/xóa sản phẩm: cần xác thực
                        .anyRequest().authenticated())
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
