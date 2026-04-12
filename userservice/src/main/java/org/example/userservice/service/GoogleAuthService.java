package org.example.userservice.service;

import org.example.userservice.dto.GoogleUserInfo;
import org.example.userservice.dto.LoginResponse;

public interface GoogleAuthService {
    LoginResponse loginWithGoogle(String code, String redirectUri);
    GoogleUserInfo getUserInfoFromGoogle(String accessToken);
}
