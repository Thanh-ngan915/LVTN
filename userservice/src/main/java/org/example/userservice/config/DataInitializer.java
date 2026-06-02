package org.example.userservice.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.userservice.entity.Account;
import org.example.userservice.entity.User;
import org.example.userservice.repository.AccountRepository;
import org.example.userservice.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (!accountRepository.existsByUsername("admin")) {
            String userId = UUID.randomUUID().toString();

            User adminUser = User.builder()
                    .id(userId)
                    .fullName("System Admin")
                    .email("admin@system.com")
                    .role("ADMIN")
                    .status("ACTIVE")
                    .build();
            userRepository.save(adminUser);

            Account adminAccount = Account.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("Admin@123"))
                    .userId(userId)
                    .role("ADMIN")
                    .createdBy("system")
                    .updatedBy("system")
                    .build();
            accountRepository.save(adminAccount);

            log.info("✅ Admin account created: admin / Admin@123");
        }
    }
}
