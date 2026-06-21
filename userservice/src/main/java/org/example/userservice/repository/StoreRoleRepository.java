package org.example.userservice.repository;

import org.example.userservice.entity.StoreRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreRoleRepository extends JpaRepository<StoreRole, String> {
    /** Đếm số seller đang hoạt động (role=SELLER, status=active) */
    long countByRoleAndStatus(String role, String status);
}
