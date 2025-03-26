package com.ssafy.ddingga.facade.user.dto.response;

import com.ssafy.ddingga.domain.user.entity.User;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserUpdateResponseDto {
	private String username;
	private String profileImage;

	/**
	 * User 엔티티를 DTO로 변환하는 정적 팩토리 메서드
	 *
	 * @param user 변환할 User 엔티티
	 * @return UserUpdateResponseDto 객체
	 */
	public static UserUpdateResponseDto from(User user) {
		return UserUpdateResponseDto.builder()
			.username(user.getUsername())
			.profileImage(user.getProfileImage())
			.build();
	}
}
