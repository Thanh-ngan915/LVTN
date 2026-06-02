package org.example.userservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.userservice.dto.PasswordRequest;
import org.example.userservice.dto.UserDTO;
import org.example.userservice.entity.Account;
import org.example.userservice.entity.StoreRole;
import org.example.userservice.entity.User;
import org.example.userservice.repository.AccountRepository;
import org.example.userservice.repository.StoreRoleRepository;
import org.example.userservice.repository.UserRepository;
import org.example.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor //tự động inject repo qua constructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    @Override
    public UserDTO getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Account account = accountRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        String displayRole = account.getRole();
        String storeRoleId = account.getStoreRoleId();

        if (storeRoleId != null) {
            storeRoleRepository.findById(storeRoleId)
                    .ifPresent(sr -> {
                    });

            // Check storerole có phải SELLER active không
            boolean isSeller = storeRoleRepository.findById(storeRoleId)
                    .map(sr -> "SELLER".equals(sr.getRole()) && "ACTIVE".equals(sr.getStatus()))
                    .orElse(false);

            if (isSeller) {
                displayRole = "SELLER";
            }
        }

        return UserDTO.builder()
                .id(userId)
                .username(account.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .image(user.getImage())
                .birthday(user.getBirthday())
                .address(user.getAddress())
                .status(user.getStatus())
                .rankId(user.getRankId())
                .role(displayRole)       // SELLER / USER / ADMIN
                .storeRoleId(storeRoleId)
                .build();
    }

    @Override
    @Transactional
    public UserDTO updateProfile(String userId, UserDTO userDTO){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setFullName(userDTO.getFullName());
        user.setEmail(userDTO.getEmail());
        user.setAddress(userDTO.getAddress());
        user.setBirthday(userDTO.getBirthday());
        user.setUpdateAt(new Timestamp(System.currentTimeMillis()).toLocalDateTime());
        User updatedUser = userRepository.save(user);
        return getProfile(userId);
    }

    @Override
    @Transactional
    public void updatePassword(String userId, PasswordRequest request) {
        Account account = accountRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Verify mật khẩu cũ
        if (!passwordEncoder.matches(request.getOldPassword(), account.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không chính xác");
        }

        // Kiểm tra confirm password
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            throw new RuntimeException("Mật khẩu mới không khớp");
        }

        account.setPassword(passwordEncoder.encode(request.getNewPassword()));
        accountRepository.save(account);
    }

    @Override
    @Transactional
    public void updateUserName(String userId, String newUserName) {
        if (accountRepository.existsByUsername(newUserName)) {
            throw new RuntimeException("Username already exists");
        }
        int updated = accountRepository.updateUsernameByUserId(userId, newUserName, LocalDateTime.now());
        if (updated == 0) {
            throw new RuntimeException("Account not found");
        }
    }

    @Override
    public String updateAvatar(String userId, MultipartFile file) {
        try {
            String uploadDir = "uploads/avatars/";
            java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = userId + extension;

            java.nio.file.Path filePath = uploadPath.resolve(filename);
            java.nio.file.Files.copy(file.getInputStream(), filePath,
                    java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // Dùng relative URL thay vì localhost:8085
            String imgUrl = "/uploads/avatars/" + filename;

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setImage(imgUrl);
            userRepository.save(user);

            log.info("Avatar saved: {}", filePath.toAbsolutePath());
            return imgUrl;
        } catch (Exception e) {
            log.error("Upload error: {}", e.getMessage(), e);
            throw new RuntimeException("Không thể upload ảnh: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void updateAvatarUrl(String userId, String imageUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setImage(imageUrl);
        userRepository.save(user);
    }

    @Autowired
    private StoreRoleRepository storeRoleRepository;

    @Override
    @Transactional
    public void approveStore(String userId, String storeId) {
        // 1. Tạo StoreRole
        StoreRole storeRole = StoreRole.builder()
                .id(UUID.randomUUID().toString())
                .storeRole(storeId)
                .status("active")
                .role("SELLER")
                .createdBy("admin")
                .build();
        storeRoleRepository.save(storeRole);

        // 2. Gán vào Account
        Account account = accountRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        account.setStoreRoleId(storeRole.getId());
        accountRepository.save(account);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> getProfile(user.getId()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void changeUserRole(String userId, String role) {
        if (!"USER".equals(role) && !"ADMIN".equals(role)) {
            throw new RuntimeException("Chỉ được đổi role USER hoặc ADMIN");
        }

        Account account = accountRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String actualRole = role;
        if ("USER".equals(role) && account.getStoreRoleId() != null) {
            actualRole = "SELLER";
        }

        user.setRole(actualRole);
        userRepository.save(user);
        accountRepository.updateRoleByUserId(userId, actualRole);
    }

    @Override
    @Transactional
    public void changeUserStatus(String userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(status);  // "ACTIVE" / "BANNED"
        userRepository.save(user);
    }

}
