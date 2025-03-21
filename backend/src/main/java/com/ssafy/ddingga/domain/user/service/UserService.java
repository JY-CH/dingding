package com.ssafy.ddingga.domain.user.service;

import com.ssafy.ddingga.domain.user.entity.User;
import com.ssafy.ddingga.facade.user.dto.LoginRequestDto;
import com.ssafy.ddingga.facade.user.dto.LoginResponseDto;
import com.ssafy.ddingga.facade.user.dto.SignUpRequestDto;
import com.ssafy.ddingga.facade.user.dto.SignUpResponseDto;

public interface UserService {

    /**
     * 사용자 등록(도메인 로직)
     * @param userId 사용자ID
     * @param password 비밀번호
     * @param username 사용자 이름
     * @return  생성된 사용자 엔티티
     */
    User registerUser(String userId, String password, String username);

    /**
     * 사용자 인증 (도메인 로직)
     * @param UserId 사용자 ID
     * @param password qlalfqjsgh
     * @return 인증된 사용자 엔티티
     */
    User authenticateUser(String UserId, String password);

}
