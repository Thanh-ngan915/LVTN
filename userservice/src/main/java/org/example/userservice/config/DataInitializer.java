package org.example.userservice.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.userservice.entity.Account;
import org.example.userservice.entity.Permission;
import org.example.userservice.entity.User;
import org.example.userservice.repository.AccountRepository;
import org.example.userservice.repository.PermissionRepository;
import org.example.userservice.repository.StoreRoleRepository;
import org.example.userservice.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder;
    private final StoreRoleRepository storeRoleRepository;

    @Override
    @Transactional
    public void run(String... args) {
        // admin: toàn quyền
        seedAdmin("admin",          "Admin@123",   "System Admin",      "ADMIN", List.of("ALL"));

        // Quản lý shop: xem dashboard, danh sách users, quản lý shop
        seedAdmin("shopmanager",    "Shop@123",    "Quản lý shop",      "ADMIN", List.of("dashboard", "users", "shops"));

        // Quản lý sản phẩm: xem dashboard, quản lý sản phẩm
        seedAdmin("productmanager", "Product@123", "Quản lý sản phẩm", "ADMIN", List.of("dashboard", "products"));

        // Sync role SELLER cho các user đã có StoreRole active (data cũ)
        syncSellerRoles();
    }

    /**
     * Cập nhật user.role = "SELLER" cho những user đã có shop được duyệt
     * nhưng chưa được cập nhật role trong bảng user.
     */
    @Transactional
    public void syncSellerRoles() {
        int count = 0;
        for (Account account : accountRepository.findAll()) {
            String storeRoleId = account.getStoreRoleId();
            if (storeRoleId == null || storeRoleId.isBlank()) continue;

            boolean isActiveSeller = storeRoleRepository.findById(storeRoleId)
                    .map(sr -> "SELLER".equals(sr.getRole()) && "active".equalsIgnoreCase(sr.getStatus()))
                    .orElse(false);

            if (isActiveSeller) {
                boolean accountUpdated = false;
                if (!"SELLER".equals(account.getRole())) {
                    account.setRole("SELLER");
                    accountRepository.save(account);
                    accountUpdated = true;
                }

                userRepository.findById(account.getUserId()).ifPresent(user -> {
                    if (!"SELLER".equals(user.getRole())) {
                        user.setRole("SELLER");
                        userRepository.save(user);
                    }
                });

                if (accountUpdated) count++;
            }
        }
        if (count > 0) log.info("🔄 Synced {} account(s)/user(s) to SELLER role", count);
    }

    /**
     * Tạo hoặc CẬP NHẬT admin account + permissions.
     * Nếu account đã tồn tại → xóa permissions cũ và tạo lại theo sections mới.
     */
    private void seedAdmin(String username, String rawPassword, String fullName, String role, List<String> sections) {
        if (accountRepository.existsByUsername(username)) {
            // Account đã có → chỉ cập nhật permissions
            accountRepository.findById(username).ifPresent(account -> {
                // Xóa tất cả permissions cũ
                permissionRepository.deleteByUserId(account.getUserId());

                // Tạo lại permissions mới
                for (String section : sections) {
                    permissionRepository.save(Permission.builder()
                            .id(UUID.randomUUID().toString())
                            .instance(section)
                            .permission("READ")
                            .userId(account.getUserId())
                            .createdBy("system")
                            .updatedBy("system")
                            .build());
                }
                log.info("🔄 Admin permissions updated: {} | sections={}", username, sections);
            });
            return;
        }

        // Tạo mới
        String userId = UUID.randomUUID().toString();

        User adminUser = User.builder()
                .id(userId)
                .fullName(fullName)
                .email(username + "@system.com")
                .role(role)
                .status("ACTIVE")
                .build();
        userRepository.save(adminUser);

        Account adminAccount = Account.builder()
                .username(username)
                .password(passwordEncoder.encode(rawPassword))
                .userId(userId)
                .role(role)
                .createdBy("system")
                .updatedBy("system")
                .build();
        accountRepository.save(adminAccount);

        for (String section : sections) {
            permissionRepository.save(Permission.builder()
                    .id(UUID.randomUUID().toString())
                    .instance(section)
                    .permission("READ")
                    .userId(userId)
                    .createdBy("system")
                    .updatedBy("system")
                    .build());
        }
        log.info("✅ Admin created: {} / {} | role={} | sections={}", username, rawPassword, role, sections);
    }
}