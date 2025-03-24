package com.ssafy.ddingga.facade.user.service;


import com.ssafy.ddingga.domain.user.entity.User;
import com.ssafy.ddingga.domain.user.service.JwtService;
import com.ssafy.ddingga.domain.user.service.UserService;
import com.ssafy.ddingga.facade.user.dto.*;
import com.ssafy.ddingga.global.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserFacadeServiceImpl implements UserFacadeService {
    private final UserService userService;
    private final JwtService jwtService;
    private final JwtTokenProvider jwtTokenProvider;


    @Override
    public SignUpResponseDto signUp(SignUpRequestDto request) {
        User user = userService.registerUser(
                request.getUserId(),
                request.getPassword(),
                request.getUserName()
        );
        TokenResponseDto tokens = jwtService.issueToken(user);

        return SignUpResponseDto.from(user,tokens);
    }

    @Override
    public LoginResponseDto login(LoginRequestDto request) {
        User user = userService.authenticateUser(
                request.getUserId(),
                request.getPassword()
        );
        TokenResponseDto tokens = jwtService.issueToken(user);

        return LoginResponseDto.builder()
                .username(user.getUsername())
                .accessToken(tokens.getAccessToken())
                .refreshToken(tokens.getRefreshToken())
                .build();
    }

    @Override
    public UserUpdateResponseDto updateUserInfo(String userId, UserUpdateRequestDto request) {
        //UserService를 통해 사용자 정보 업데이트
        User updateUser = userService.updateUser(
                userId,
                request.getUsername(),
                request.getProfileImage()
        );

        // 업데이트된 사용자 정보를 DTO로 변환하여 반환
        return UserUpdateResponseDto.from(updateUser);
    }

    /**
     * 사용자 로그아웃 처리
     * 1. 엑세스 토큰에서 사용자 정보 추출
     * 2. 사용자의 리프레시 토큰을 무효화
     * 3. 로그아웃 겅공 응답 반환
     */
    @Override
    public LogoutResponseDto logout(String accessToken) {
        // 토큰에서 사용자 정보 추출
        String userId = jwtTokenProvider.getUserId(accessToken);

        // 로그아웃 기능 호출
        jwtService.invalidateRefreshToken(userId);

        return LogoutResponseDto.builder()
                .message("로그아웃이 완료되었습니다.")
                .build();
    }


    @Override
    public TokenResponseDto refreshToken(String refreshToken) {
        return jwtService.refreshToken(refreshToken);
    }
}
