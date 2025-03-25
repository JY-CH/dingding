package com.ssafy.ddingga.facade.user.service;


import com.ssafy.ddingga.facade.user.dto.request.LoginRequestDto;
import com.ssafy.ddingga.facade.user.dto.request.SignUpRequestDto;
import com.ssafy.ddingga.facade.user.dto.request.UserUpdateRequestDto;
import com.ssafy.ddingga.facade.user.dto.response.*;
import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.user.entity.User;
import com.ssafy.ddingga.domain.user.service.JwtService;
import com.ssafy.ddingga.domain.user.service.UserService;
import com.ssafy.ddingga.global.security.jwt.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserFacadeServiceImpl implements UserFacadeService {
    private final UserService userService;
    private final JwtService jwtService;
    private final JwtTokenProvider jwtTokenProvider;


    @Override
    public SignUpResponseDto signUp(SignUpRequestDto request) {
        // user 엔티티만 생성
        User user = userService.registerUser(
                request.getLoginId(),
                request.getPassword(),
                request.getUsername()
        );

        // 토큰 없이 회원 가입 정보만 반환
        return SignUpResponseDto.builder()
                .loginId(user.getLoginId())
                .username(user.getUsername())
                .build();
    }

    @Override
    public LoginResponseDto login(LoginRequestDto request) {
        User user = userService.authenticateUser(
                request.getLoginId(),
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
    public UserUpdateResponseDto updateUserInfo(String loginId, UserUpdateRequestDto request) {
        //UserService를 통해 사용자 정보 업데이트
        User updateUser = userService.updateUser(
                loginId,
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
        String loginId = jwtTokenProvider.getLoginId(accessToken);

        // 로그아웃 기능 호출
        jwtService.invalidateRefreshToken(loginId);

        return LogoutResponseDto.builder()
                .message("로그아웃이 완료되었습니다.")
                .build();
    }


    @Override
    public TokenResponseDto refreshToken(String refreshToken) {
        return jwtService.refreshToken(refreshToken);
    }


    @Override
    public UserDeleteResponseDto deleteUser(String loginId) {
        //회원 탈퇴 처리
        User deletedUser = userService.deleteUser(loginId);
        //로그아웃과 동일하게 토큰 무효화 처리
        jwtService.invalidateRefreshToken(loginId);
        // 응답 생성
        return new UserDeleteResponseDto(
                "회원탈퇴가 완료되었습니다.",
                deletedUser.getLoginId()
        );
    }
}