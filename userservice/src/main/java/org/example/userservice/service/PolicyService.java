package org.example.userservice.service;

import org.example.userservice.dto.PolicyDto;
import org.example.userservice.dto.PolicyRequest;

import java.util.List;

public interface PolicyService {
    List<PolicyDto> getAllPolicies();
    List<PolicyDto> getActivePolicies();
    PolicyDto getPolicyById(String id);
    PolicyDto createPolicy(PolicyRequest request, String adminId);
    PolicyDto updatePolicy(String id, PolicyRequest request, String adminId);
    void deletePolicy(String id);
}
