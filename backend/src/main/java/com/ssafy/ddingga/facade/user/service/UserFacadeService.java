package com.ssafy.ddingga.facade.user.service;

import com.ssafy.ddingga.facade.user.dto.request.LoginRequestDto;
import com.ssafy.ddingga.facade.user.dto.request.SignUpRequestDto;
import com.ssafy.ddingga.facade.user.dto.request.UserUpdateRequestDto;
import com.ssafy.ddingga.facade.user.dto.response.*;

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

    /**
     * 사용자 정보 수정을 처리하는 메서드
     * @param loginId 수정할 사용자의 아이디
     * @param request 수정할 회원 정보가 담긴 DTO
     * @return 수정된 회원정보 DTO
     */
    UserUpdateResponseDto updateUserInfo(String loginId, UserUpdateRequestDto request);

    /**
     * 회원 탈퇴 처리
     * @param loginId 탈퇴할 사용자의 ID
     * @return 탈퇴 처리 결과 DTO
     */
    UserDeleteResponseDto deleteUser(String loginId);
}
