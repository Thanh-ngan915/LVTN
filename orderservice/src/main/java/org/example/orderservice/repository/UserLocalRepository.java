package org.example.orderservice.repository;

import org.example.orderservice.entity.UserLocal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserLocalRepository extends JpaRepository<UserLocal, String> {
    Optional<UserLocal> findByUsername(String username);
}
