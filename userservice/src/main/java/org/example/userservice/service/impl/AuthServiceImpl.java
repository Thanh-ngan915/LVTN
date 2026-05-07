package org.example.userservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.userservice.dto.*;
import org.example.userservice.entity.Account;
import org.example.userservice.entity.Permission;
import org.example.userservice.entity.StoreRole;
import org.example.userservice.entity.User;
import org.example.userservice.exception.InvalidCredentialsException;
import org.example.userservice.exception.UsernameAlreadyExistsException;
import org.example.userservice.kafka.UserSyncProducer;
import org.example.userservice.repository.AccountRepository;
import org.example.userservice.repository.PermissionRepository;
import org.example.userservice.repository.StoreRoleRepository;
import org.example.userservice.repository.UserRepository;
import org.example.userservice.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final StoreRoleRepository storeRoleRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder;
    private final org.example.userservice.config.JwtTokenProvider jwtTokenProvider;

    @Autowired(required = false)
    private UserSyncProducer userSyncProducer;

    public AuthServiceImpl(
            AccountRepository accountRepository,
            UserRepository userRepository,
            StoreRoleRepository storeRoleRepository,
            PermissionRepository permissionRepository,
            PasswordEncoder passwordEncoder,
            org.example.userservice.config.JwtTokenProvider jwtTokenProvider
    ) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.storeRoleRepository = storeRoleRepository;
        this.permissionRepository = permissionRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        // 1. Check if username already exists
        if (accountRepository.existsByUsername(request.getUsername())) {
            throw new UsernameAlreadyExistsException(
                    "Username '" + request.getUsername() + "' đã tồn tại");
        }

        // 2. Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UsernameAlreadyExistsException(
                    "Email '" + request.getEmail() + "' đã được sử dụng");
        }

        // 3. Create User
        String userId = UUID.randomUUID().toString();
        User user = User.builder()
                .id(userId)
                .fullName(request.getFullName())
                .email(request.getEmail())
                .address(request.getAddress())
                .image(request.getImage())
                .role("USER")
                .status("ACTIVE")
                .permission("READ")
                .build();
        userRepository.save(user);

        // 4. Create StoreRole
        String storeRoleId = UUID.randomUUID().toString();
        StoreRole storeRole = StoreRole.builder()
                .id(storeRoleId)
                .storeRole("DEFAULT")
                .status("ACTIVE")
                .role("USER")
                .createdBy(request.getUsername())
                .updatedBy(request.getUsername())
                .build();
        storeRoleRepository.save(storeRole);

        // 5. Create Permission
        String permissionId = UUID.randomUUID().toString();
        Permission permission = Permission.builder()
                .id(permissionId)
                .instance("DEFAULT")
                .permission("READ")
                .userId(userId)
                .createdBy(request.getUsername())
                .updatedBy(request.getUsername())
                .build();
        permissionRepository.save(permission);

        // 6. Create Account
        Account account = Account.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .userId(userId)
                .storeRoleId(storeRoleId)
                .role("USER")
                .createdBy(request.getUsername())
                .updatedBy(request.getUsername())
                .build();
        accountRepository.save(account);

        // 7. Gửi Kafka sync message (nếu Kafka được bật)
        if (userSyncProducer != null) {
            try {
                userSyncProducer.sendUserSync(UserSyncMessage.builder()
                        .userId(userId)
                        .username(account.getUsername())
                        .fullName(user.getFullName())
                        .image(user.getImage())
                        .action("CREATE")
                        .build());
            } catch (Exception e) {
                log.warn("Failed to send user sync on register: {}", e.getMessage());
            }
        } else {
            log.info("Kafka disabled - skipping user sync for register: {}", account.getUsername());
        }

        // 8. Return response
        return RegisterResponse.builder()
                .username(account.getUsername())
                .userId(userId)
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(account.getRole())
                .message("Đăng ký thành công!")
                .createdAt(account.getCreatedAt())
                .build();
    }
    @Override
    public LoginResponse login(LoginRequest request) {
        // 1. Find account by username
        Account account = accountRepository.findById(request.getUsername())
                .orElseThrow(() -> new InvalidCredentialsException("Tài khoản hoặc mật khẩu không chính xác"));

        // 2. Compare password
        if (!passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            throw new InvalidCredentialsException("Tài khoản hoặc mật khẩu không chính xác");
        }

        // 3. Get user info
        User user = userRepository.findById(account.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 4. Generate JWT Token
        String token = jwtTokenProvider.generateToken(account.getUsername(), account.getRole());

        // 5. Gửi Kafka sync message (nếu Kafka được bật)
        if (userSyncProducer != null) {
            try {
                userSyncProducer.sendUserSync(UserSyncMessage.builder()
                        .userId(account.getUserId())
                        .username(account.getUsername())
                        .fullName(user.getFullName())
                        .image(user.getImage())
                        .action("UPDATE")
                        .build());
            } catch (Exception e) {
                log.warn("Failed to send user sync on login: {}", e.getMessage());
            }
        } else {
            log.info("Kafka disabled - skipping user sync for login: {}", account.getUsername());
        }

        // 6. Build Response
        return LoginResponse.builder()
                .username(account.getUsername())
                .userId(account.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(account.getRole())
                .message("Đăng nhập thành công!")
                .token(token)
                .build();
    }
}
