package org.example.userservice.service;

import org.example.userservice.dto.PasswordRequest;
import org.example.userservice.dto.UserDTO;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    UserDTO getProfile (String userId);
    UserDTO updateProfile(String userId, UserDTO userDTO);
    void updatePassword (String userId, PasswordRequest request);
    void updateUserName (String userId, String newUserName);
    String updateAvatar (String userId, MultipartFile file);
    void updateAvatarUrl(String userId, String imageUrl);
    void approveStore(String userId, String storeId);
}
