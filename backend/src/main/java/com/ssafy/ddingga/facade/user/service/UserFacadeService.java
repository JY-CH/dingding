package com.ssafy.ddingga.facade.user.service;

import com.ssafy.ddingga.facade.user.dto.*;

public interface UserFacadeService {
    SignUpResponseDto signUp(SignUpRequestDto request);
    TokenResponseDto refreshToken(String refreshToken);
    LoginResponseDto login(LoginRequestDto request);

    /**
     * 사용자 로그아웃 처리
     * @param accessToken 사용자의 엑세스 토큰
     * @return 로그아웃 결과
     */
    LogoutResponseDto logout(String accessToken);
}
