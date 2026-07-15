package org.example.userservice.controller;

import org.example.userservice.dto.PolicyDto;
import org.example.userservice.dto.PolicyRequest;
import org.example.userservice.service.PolicyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PolicyController {

    @Autowired
    private PolicyService policyService;

    // Public API
    @GetMapping("/policies")
    public ResponseEntity<List<PolicyDto>> getActivePolicies() {
        return ResponseEntity.ok(policyService.getActivePolicies());
    }

    // Admin API
    @GetMapping("/admin/policies")
    public ResponseEntity<List<PolicyDto>> getAllPolicies() {
        return ResponseEntity.ok(policyService.getAllPolicies());
    }

    @PostMapping("/admin/policies")
    public ResponseEntity<PolicyDto> createPolicy(
            @RequestBody PolicyRequest request,
            @RequestHeader("X-User-Id") String adminId) {
        return ResponseEntity.ok(policyService.createPolicy(request, adminId));
    }

    @PutMapping("/admin/policies/{id}")
    public ResponseEntity<PolicyDto> updatePolicy(
            @PathVariable String id,
            @RequestBody PolicyRequest request,
            @RequestHeader("X-User-Id") String adminId) {
        return ResponseEntity.ok(policyService.updatePolicy(id, request, adminId));
    }

    @DeleteMapping("/admin/policies/{id}")
    public ResponseEntity<Void> deletePolicy(@PathVariable String id) {
        policyService.deletePolicy(id);
        return ResponseEntity.noContent().build();
    }
}
