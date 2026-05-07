package org.example.userservice.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.userservice.dto.PasswordRequest;
import org.example.userservice.dto.UserDTO;
import org.example.userservice.entity.Account;
import org.example.userservice.entity.User;
import org.example.userservice.repository.AccountRepository;
import org.example.userservice.repository.UserRepository;
import org.example.userservice.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor //tự động inject repo qua constructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    @Override
    public UserDTO getProfile (String userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Account account = accountRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        return UserDTO.builder()
                .username(account.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .image(user.getImage())
                .birthday(user.getBirthday())
                .address(user.getAddress())
                .status(user.getStatus())
                .rankId(user.getRankId())
                .build();
    }

    @Override
    @Transactional
    public UserDTO updateProfile(String userId, UserDTO userDTO){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setFullName(userDTO.getFullName());
        user.setEmail(userDTO.getEmail());
        user.setAddress(userDTO.getAddress());
        user.setBirthday(userDTO.getBirthday());
        user.setUpdateAt(new Timestamp(System.currentTimeMillis()).toLocalDateTime());
        User updatedUser = userRepository.save(user);
        return getProfile(userId);
    }

    @Override
    @Transactional
    public void updatePassword (String userId, PasswordRequest request){
        Account account = accountRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        account.setPassword(request.getNewPassword());
        account.setUpdateAt(LocalDateTime.now());
        accountRepository.save(account);
    }

    @Override
    @Transactional
    public void updateUserName (String userId, String newUserName){
        if(accountRepository.existsByUsername(newUserName)){
            throw new RuntimeException("Username already exists");
        }
        Account account = accountRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        account.setUsername(newUserName);
        account.setUpdateAt(LocalDateTime.now());
        accountRepository.save(account);
    }

    @Override
    public String updateAvatar (String userId, MultipartFile file){
        String imgUrl = "https://your-storage.com/avatar/" + userId + ".jpg"; //gia lap
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setImage(imgUrl);
        userRepository.save(user);
        return imgUrl;
    }
}
