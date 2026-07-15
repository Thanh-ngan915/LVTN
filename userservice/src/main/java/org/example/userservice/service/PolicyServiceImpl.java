package org.example.userservice.service;

import org.example.userservice.dto.PolicyDto;
import org.example.userservice.dto.PolicyRequest;
import org.example.userservice.entity.Policy;
import org.example.userservice.entity.User;
import org.example.userservice.repository.PolicyRepository;
import org.example.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PolicyServiceImpl implements PolicyService {

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PolicyDto> getAllPolicies() {
        return policyRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PolicyDto> getActivePolicies() {
        return policyRepository.findByStatus("ACTIVE").stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PolicyDto getPolicyById(String id) {
        Policy policy = policyRepository.findById(id).orElseThrow(() -> new RuntimeException("Policy not found"));
        return mapToDto(policy);
    }

    @Override
    @Transactional
    public PolicyDto createPolicy(PolicyRequest request, String adminId) {
        User admin = userRepository.findById(adminId).orElseThrow(() -> new RuntimeException("Admin not found"));
        
        Policy policy = Policy.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .type(request.getType())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .createdBy(admin)
                .build();
                
        return mapToDto(policyRepository.save(policy));
    }

    @Override
    @Transactional
    public PolicyDto updatePolicy(String id, PolicyRequest request, String adminId) {
        Policy policy = policyRepository.findById(id).orElseThrow(() -> new RuntimeException("Policy not found"));
        User admin = userRepository.findById(adminId).orElseThrow(() -> new RuntimeException("Admin not found"));
        
        policy.setTitle(request.getTitle());
        policy.setContent(request.getContent());
        policy.setType(request.getType());
        if (request.getStatus() != null) {
            policy.setStatus(request.getStatus());
        }
        policy.setUpdatedBy(admin);
        
        return mapToDto(policyRepository.save(policy));
    }

    @Override
    @Transactional
    public void deletePolicy(String id) {
        policyRepository.deleteById(id);
    }

    private PolicyDto mapToDto(Policy policy) {
        return PolicyDto.builder()
                .id(policy.getId())
                .title(policy.getTitle())
                .content(policy.getContent())
                .type(policy.getType())
                .status(policy.getStatus())
                .createdAt(policy.getCreatedAt())
                .updatedAt(policy.getUpdatedAt())
                .createdById(policy.getCreatedBy() != null ? policy.getCreatedBy().getId() : null)
                .createdByName(policy.getCreatedBy() != null ? policy.getCreatedBy().getFullName() : null)
                .updatedById(policy.getUpdatedBy() != null ? policy.getUpdatedBy().getId() : null)
                .updatedByName(policy.getUpdatedBy() != null ? policy.getUpdatedBy().getFullName() : null)
                .build();
    }
}
