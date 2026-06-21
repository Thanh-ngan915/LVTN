package org.example.userservice.repository;

import org.example.userservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByStatus(String status);
    long countByRole(String role);

    /**
     * Chỉ đếm user có Account — khớp với getAllUsers() (bỏ qua orphan user không có account)
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.id IN (SELECT a.userId FROM Account a)")
    long countUsersWithAccount();

    /**
     * Đếm user theo status, chỉ tính những user có Account
     */
    @Query("SELECT COUNT(u) FROM User u WHERE u.status = :status AND u.id IN (SELECT a.userId FROM Account a)")
    long countByStatusWithAccount(@Param("status") String status);
}
