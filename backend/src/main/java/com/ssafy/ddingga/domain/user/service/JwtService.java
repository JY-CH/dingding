package com.ssafy.ddingga.domain.user.service;

import com.ssafy.ddingga.domain.user.entity.User;

public interface JwtService {

    //JWT 토큰 생성
    String createToken(User user);

    // JWT 토큰 검증
    boolean validateToken(String token);

    // JWT 토큰에서 사용자 ID 추출
    String getUserIdFromToken(String token);
    
}

