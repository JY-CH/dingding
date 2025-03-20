package com.ssafy.ddingga.domain.user.service;

import com.ssafy.ddingga.domain.user.entity.User;
import com.ssafy.ddingga.facade.user.dto.TokenResponseDto;

public interface JwtService {
    TokenResponseDto issueToken(User user);
}

