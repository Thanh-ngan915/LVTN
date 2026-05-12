package org.example.orderservice.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final org.example.orderservice.repository.UserLocalRepository userLocalRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && jwtTokenProvider.validateToken(jwt)) {
                String username = jwtTokenProvider.getUsernameFromToken(jwt);
                String userId = jwtTokenProvider.getUserIdFromToken(jwt);
                String role = jwtTokenProvider.getRoleFromToken(jwt);
                String fullName = jwtTokenProvider.getFullNameFromToken(jwt);
                String image = jwtTokenProvider.getImageFromToken(jwt);

                log.debug("Extracted from token: userId={}, username={}, fullName={}", userId, username, fullName);

                // ✅ ĐỒNG NHẤT DỮ LIỆU QUA ACCESS TOKEN
                // Thay thế Kafka: Cập nhật thông tin user vào DB local của OrderService mỗi khi user gọi API
                if (userId != null) {
                    syncUserLocal(userId, username, fullName, image);
                }

                List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userId, 
                        null,
                        authorities
                );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            log.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    private void syncUserLocal(String userId, String username, String fullName, String image) {
        try {
            var existingUser = userLocalRepository.findById(userId);
            if (existingUser.isPresent()) {
                var user = existingUser.get();
                boolean changed = false;
                if (fullName != null && !fullName.equals(user.getFullName())) { user.setFullName(fullName); changed = true; }
                if (image != null && !image.equals(user.getImage())) { user.setImage(image); changed = true; }
                if (username != null && !username.equals(user.getUsername())) { user.setUsername(username); changed = true; }
                if (changed) userLocalRepository.save(user);
            } else {
                var user = org.example.orderservice.entity.UserLocal.builder()
                        .id(userId)
                        .username(username)
                        .fullName(fullName)
                        .image(image)
                        .build();
                userLocalRepository.save(user);
                log.info("Created user_local from token: userId={}", userId);
            }
        } catch (Exception e) {
            log.warn("Failed to sync user local from token: {}", e.getMessage());
        }
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
