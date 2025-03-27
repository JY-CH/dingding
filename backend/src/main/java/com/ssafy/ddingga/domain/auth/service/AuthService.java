package com.ssafy.ddingga.domain.auth.service;

import org.springframework.web.multipart.MultipartFile;

import com.ssafy.ddingga.domain.auth.entity.User;

public interface AuthService {

	/**
	 * 사용자 등록(도메인 로직)
	 * @param loginId 사용자ID
	 * @param password 비밀번호
	 * @param username 사용자 이름
	 * @return 생성된 사용자 엔티티
	 */
	User registerUser(String loginId, String password, String username);

	/**
	 * 사용자 인증 (도메인 로직)
	 * @param loginId 사용자 ID
	 * @param password 비밀번호
	 * @return 인증된 사용자 엔티티
	 */
	User authenticateUser(String loginId, String password);

	/**
	 * 사용자 정보 변경
	 * @param loginId 사용자 고유 ID
	 * @param username 변경할 사용자 이름 사용자 이름 (null인경우 기존 이름 유지)
	 * @param profileImage 변경할 프로필 이미지 파일 ((null인경우 기존 이름 유지)
	 * @return 정보가 수정된 사용자 엔티티
	 */
	User updateUser(String loginId, String username, MultipartFile profileImage);

	/**
	 * 회원 탈퇴 처리
	 * @param loginId 탈퇴할 사용자의 id
	 * @return 탈퇴 처리된 사용자의 엔티티
	 */
	User deleteUser(String loginId);

	User getUser(int userId);
}
