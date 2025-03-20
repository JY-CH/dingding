package com.ssafy.ddingga.domain.user.service;


import com.ssafy.ddingga.domain.user.entity.User;
import com.ssafy.ddingga.domain.user.repository.UserRepository;
import com.ssafy.ddingga.facade.user.dto.TokenResponseDto;
import com.ssafy.ddingga.global.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * JWT (Json Web Token) 관련 서비스 구현체
 * 토큰 생성, 검증, 파싱의 기능을 제공
 */
@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Override
    public TokenResponseDto issueToken(User user) {
        String accessToken = jwtTokenProvider.createAccessToken(user);
        String refreshToken = jwtTokenProvider.createRefreshToken(user);

        // refresh token 저장 로직 구현

        return new TokenResponseDto(accessToken, refreshToken);
    }
}
