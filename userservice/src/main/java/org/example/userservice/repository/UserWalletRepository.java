package org.example.userservice.repository;

import org.example.userservice.entity.UserWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserWalletRepository extends JpaRepository<UserWallet, String> {
    Optional<UserWallet> findByUserId(String userId);
}