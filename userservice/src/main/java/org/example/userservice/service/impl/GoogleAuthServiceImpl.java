package org.example.userservice.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.userservice.config.JwtTokenProvider;
import org.example.userservice.dto.GoogleUserInfo;
import org.example.userservice.dto.LoginResponse;
import org.example.userservice.entity.Account;
import org.example.userservice.entity.Permission;
import org.example.userservice.entity.StoreRole;
import org.example.userservice.entity.User;
import org.example.userservice.repository.AccountRepository;
import org.example.userservice.repository.PermissionRepository;
import org.example.userservice.repository.StoreRoleRepository;
import org.example.userservice.repository.UserRepository;
import org.example.userservice.service.GoogleAuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleAuthServiceImpl implements GoogleAuthService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final StoreRoleRepository storeRoleRepository;
    private final PermissionRepository permissionRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${google.client-id}")
    private String clientId;

    @Value("${google.client-secret}")
    private String clientSecret;

    private static final String GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
    private static final String GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

    @Override
    @Transactional
    public LoginResponse loginWithGoogle(String code, String redirectUri) {
        // 1. Exchange authorization code for access token
        String accessToken = exchangeCodeForToken(code, redirectUri);

        // 2. Get user info from Google
        GoogleUserInfo googleUser = getUserInfoFromGoogle(accessToken);

        // 3. Find or create user in our system
        String googleEmail = googleUser.getEmail();
        Optional<User> existingUser = userRepository.findByEmail(googleEmail);

        User user;
        Account account;

        if (existingUser.isPresent()) {
            // User already exists - log them in
            user = existingUser.get();
            // Update profile picture if changed
            if (googleUser.getPicture() != null) {
                user.setImage(googleUser.getPicture());
                userRepository.save(user);
            }
            // Find account linked to this user
            account = accountRepository.findById("google_" + googleUser.getId())
                    .orElseGet(() -> {
                        // Create a Google account entry if not exists
                        return createGoogleAccount(googleUser, user.getId());
                    });
        } else {
            // New user - create account
            String userId = UUID.randomUUID().toString();

            user = User.builder()
                    .id(userId)
                    .fullName(googleUser.getName())
                    .email(googleEmail)
                    .image(googleUser.getPicture())
                    .role("USER")
                    .status("ACTIVE")
                    .permission("READ")
                    .build();
            userRepository.save(user);

            // Create StoreRole
            String storeRoleId = UUID.randomUUID().toString();
            StoreRole storeRole = StoreRole.builder()
                    .id(storeRoleId)
                    .storeRole("DEFAULT")
                    .status("ACTIVE")
                    .role("USER")
                    .createdBy("google_" + googleUser.getId())
                    .updatedBy("google_" + googleUser.getId())
                    .build();
            storeRoleRepository.save(storeRole);

            // Create Permission
            String permissionId = UUID.randomUUID().toString();
            Permission permission = Permission.builder()
                    .id(permissionId)
                    .instance("DEFAULT")
                    .permission("READ")
                    .userId(userId)
                    .createdBy("google_" + googleUser.getId())
                    .updatedBy("google_" + googleUser.getId())
                    .build();
            permissionRepository.save(permission);

            // Create Google Account
            account = createGoogleAccount(googleUser, userId);
        }

        // 4. Generate JWT token
        String token = jwtTokenProvider.generateToken(account.getUsername(), account.getRole());

        return LoginResponse.builder()
                .username(account.getUsername())
                .userId(account.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(account.getRole())
                .message("Đăng nhập bằng Google thành công!")
                .token(token)
                .build();
    }

    private Account createGoogleAccount(GoogleUserInfo googleUser, String userId) {
        String username = "google_" + googleUser.getId();
        // Use a random non-matchable password for Google accounts
        Account account = Account.builder()
                .username(username)
                .password(UUID.randomUUID().toString()) // Random password, not usable for normal login
                .userId(userId)
                .role("USER")
                .createdBy(username)
                .updatedBy(username)
                .build();
        return accountRepository.save(account);
    }

    private String exchangeCodeForToken(String code, String redirectUri) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri);
        params.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(GOOGLE_TOKEN_URL, request, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            String accessToken = root.path("access_token").asText();
            if (accessToken == null || accessToken.isEmpty()) {
                throw new RuntimeException("Không thể lấy access_token từ Google: " + response.getBody());
            }
            return accessToken;
        } catch (Exception e) {
            log.error("Error exchanging code for token: {}", e.getMessage());
            throw new RuntimeException("Lỗi khi xác thực với Google: " + e.getMessage());
        }
    }

    @Override
    public GoogleUserInfo getUserInfoFromGoogle(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<GoogleUserInfo> response = restTemplate.exchange(
                    GOOGLE_USERINFO_URL,
                    HttpMethod.GET,
                    entity,
                    GoogleUserInfo.class
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("Error getting user info from Google: {}", e.getMessage());
            throw new RuntimeException("Lỗi khi lấy thông tin người dùng từ Google: " + e.getMessage());
        }
    }
}
