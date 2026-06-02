package org.example.userservice.repository;

import org.example.userservice.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    Optional<Account> findByUsername(String username);
    Optional<Account> findByUserId(String userId);
    boolean existsByUsername(String username);
    @Modifying
    @Query("UPDATE Account a SET a.username = :newUsername, a.updateAt = :now WHERE a.userId = :userId")
    int updateUsernameByUserId(
            @Param("userId") String userId,
            @Param("newUsername") String newUsername,
            @Param("now") java.time.LocalDateTime now
    );
    @Modifying
    @Query("UPDATE Account a SET a.role = :role WHERE a.userId = :userId")
    int updateRoleByUserId(
            @Param("userId") String userId,
            @Param("role") String role
    );
}
