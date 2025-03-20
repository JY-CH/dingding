package com.ssafy.ddingga.domain.user.service;

import com.ssafy.ddingga.domain.user.entity.AuthProvider;
import com.ssafy.ddingga.domain.user.entity.User;
import com.ssafy.ddingga.facade.user.dto.TokenResponseDto;

public interface JwtService {
    TokenResponseDto issueToken(User user);
    TokenResponseDto issueToken(User user, AuthProvider provider);
    TokenResponseDto refreshToken(String refreshToken);
}

