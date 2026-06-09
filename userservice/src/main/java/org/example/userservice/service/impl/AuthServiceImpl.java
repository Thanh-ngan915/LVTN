package org.example.userservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.userservice.dto.*;
import org.example.userservice.entity.Account;
import org.example.userservice.entity.PasswordResetToken;
import org.example.userservice.entity.Permission;
import org.example.userservice.entity.StoreRole;
import org.example.userservice.entity.User;
import org.example.userservice.exception.InvalidCredentialsException;
import org.example.userservice.exception.UsernameAlreadyExistsException;
import org.example.userservice.repository.AccountRepository;
import org.example.userservice.repository.PasswordResetTokenRepository;
import org.example.userservice.repository.PermissionRepository;
import org.example.userservice.repository.StoreRoleRepository;
import org.example.userservice.repository.UserRepository;
import org.example.userservice.service.AuthService;
import org.example.userservice.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final StoreRoleRepository storeRoleRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder;
    private final org.example.userservice.config.JwtTokenProvider jwtTokenProvider;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

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
//        String storeRoleId = UUID.randomUUID().toString();
//        StoreRole storeRole = StoreRole.builder()
//                .id(storeRoleId)
//                .storeRole("DEFAULT")
//                .status("ACTIVE")
//                .role("USER")
//                .createdBy(request.getUsername())
//                .updatedBy(request.getUsername())
//                .build();
//        storeRoleRepository.save(storeRole);

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
//                .storeRoleId(storeRoleId)
                .role("USER")
                .createdBy(request.getUsername())
                .updatedBy(request.getUsername())
                .build();
        accountRepository.save(account);

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
        String token = jwtTokenProvider.generateToken(
                account.getUsername(),
                account.getUserId(),
                account.getRole(),
                user.getFullName(),
                user.getImage()
        );

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

    @Override
    public void forgotPassword(String email) {
        // 1. Tìm user theo email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với email này"));

        // 2. Tìm account của user
        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        // 3. Xóa token cũ và tạo token mới (trong transaction riêng)
        String resetToken = createResetToken(account.getUsername(), account.getUserId());

        // 4. Gửi email (ngoài transaction để không rollback DB khi mail lỗi)
        String resetLink = frontendUrl + "/reset-password?token=" + resetToken;
        try {
            emailService.sendPasswordResetEmail(email, user.getFullName(), resetLink);
        } catch (RuntimeException e) {
            log.error("Failed to send email to {}: {}", email, e.getMessage());
            throw new RuntimeException("Không thể gửi email. Vui lòng kiểm tra cấu hình SMTP hoặc thử lại sau.");
        }

        log.info("Password reset requested for email: {}, username: {}", email, account.getUsername());
    }

    @Transactional
    protected String createResetToken(String username, String userId) {
        // Xóa token cũ nếu có
        passwordResetTokenRepository.deleteByUsername(username);

        // Tạo token mới, hết hạn 15 phút
        String resetToken = UUID.randomUUID().toString();
        PasswordResetToken tokenEntity = PasswordResetToken.builder()
                .id(UUID.randomUUID().toString())
                .token(resetToken)
                .username(username)
                .userId(userId)
                .expiryDate(LocalDateTime.now().plusMinutes(15))
                .build();
        passwordResetTokenRepository.save(tokenEntity);
        return resetToken;
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        // 1. Tìm token trong DB
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token không hợp lệ hoặc đã được sử dụng"));

        // 2. Kiểm tra hết hạn
        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken);
            throw new RuntimeException("Token đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới.");
        }

        // 3. Tìm account và cập nhật password
        Account account = accountRepository.findByUsername(resetToken.getUsername())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        account.setPassword(passwordEncoder.encode(newPassword));
        accountRepository.save(account);

        // 4. Xóa token sau khi dùng (one-time use)
        passwordResetTokenRepository.delete(resetToken);

        log.info("Password reset successfully for username: {}", account.getUsername());
    }
}
