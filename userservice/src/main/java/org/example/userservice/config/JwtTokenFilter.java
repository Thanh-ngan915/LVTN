package org.example.userservice.config;

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
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Lấy token từ Header "Authorization: Bearer <token>"
        String jwt = getJwtFromRequest(request);
        
        // DEBUG: Log authorization header
        String authHeader = request.getHeader("Authorization");
        log.debug("Authorization header: {}", authHeader);
        log.debug("Extracted JWT: {}", jwt);

        // 2. Kiểm tra token có hợp lệ không
        if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
            String username = tokenProvider.getUsernameFromToken(jwt);
            String role = tokenProvider.getRoleFromToken(jwt);
            String permissions = tokenProvider.getPermissionsFromToken(jwt);
            log.debug("Token valid for user: {} with role: {}", username, role);

            // 3. Tạo authorities từ role
            List<SimpleGrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("ROLE_" + (role != null && !role.isEmpty() ? role : "USER")));

            if (permissions != null && !permissions.isBlank()) {
                if ("ALL".equals(permissions)) {
                    authorities.add(new SimpleGrantedAuthority("PERM_ALL"));
                } else {
                    for (String p : permissions.split(",")) {
                        if (!p.isBlank()) authorities.add(new SimpleGrantedAuthority("PERM_" + p.trim()));
                    }
                }
            }

            // 4. Tạo đối tượng Authentication với authorities
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(username, null, authorities);
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } else {
            log.warn("No valid JWT found. JWT: {}, has text: {}", jwt, StringUtils.hasText(jwt));
            if (StringUtils.hasText(jwt)) {
                log.warn("Token validation failed");
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}