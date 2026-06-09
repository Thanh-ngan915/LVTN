package org.example.productservice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
                // Đọc sản phẩm: public
                .requestMatchers(
                    "/api/products",
                    "/api/products/*",
                    "/api/products/category/**",
                    "/api/products/search",
                    "/api/products/store/**",
                    "/api/products/store/*/**",
                    "/api/categories",
                    "/api/categories/**",
                    "/api/cart/count"
                ).permitAll()
                    .requestMatchers(
                            "/api/products/*/approve",
                            "/api/products/*/reject",
                            "/api/products/*/hide",
                            "/api/products/stats"
                    ).hasRole("ADMIN")
//               .anyRequest().authenticated()
                // Giỏ hàng cần xác thực (trừ /count)
                .requestMatchers("/api/cart/**").authenticated()
                // Tạo/sửa/xóa sản phẩm: cần xác thực
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
