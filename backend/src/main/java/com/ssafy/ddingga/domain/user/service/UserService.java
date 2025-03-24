package com.ssafy.ddingga.domain.user.service;

import com.ssafy.ddingga.domain.user.entity.User;
import com.ssafy.ddingga.facade.user.dto.LoginRequestDto;
import com.ssafy.ddingga.facade.user.dto.LoginResponseDto;
import com.ssafy.ddingga.facade.user.dto.SignUpRequestDto;
import com.ssafy.ddingga.facade.user.dto.SignUpResponseDto;
import org.springframework.web.multipart.MultipartFile;

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
     * @param userId 사용자 ID
     * @param password 비밀번호
     * @return 인증된 사용자 엔티티
     */
    User authenticateUser(String userId, String password);

    /**
     * 사용자 정보 변경
     * @param userId 사용자 고유 ID
     * @param username 변경할 사용자 이름 사용자 이름 (null인경우 기존 이름 유지)
     * @param profileImage 변경할 프로필 이미지 파일 ((null인경우 기존 이름 유지)
     * @return 정보가 수정된 사용자 엔티티
     */
    User updateUser(String userId, String username, MultipartFile profileImage);

    /**
     * 회원 탈퇴 처리
     * @param userId 탈퇴할 사용자의 id
     * @return 탈퇴 처리된 사용자의 엔티티
     */
    User deleteUser(String userId);
}
