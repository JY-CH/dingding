package com.ssafy.ddingga.domain.auth.entity;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Setter
@Getter
@Builder
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer userId; // userPk

	@Column(unique = true)
	private String loginId;  // user의 id
	private String password; // user 비밀번호
	private String username;    // user 닉네임(이름)
	private LocalDateTime createAt; // 가입일자
	private String profileImage;    // 프로필이미지
	@Builder.Default
	private Boolean isDeleted = false;  // 회원탈퇴여부

	/** 사용자가 어떤 권한을 가지고 있는지 정의,
	 * JWT 토큰에 이 권한정보가 포함, API 요청 시 권한검사에 사용
	 */
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// 모든 사용자는 기본적으로 USER 권한을 가짐 나중에 관리자 추가하게 되면
		// ROLE enum을 통해 권한 부여
		return List.of(new SimpleGrantedAuthority("ROLE_USER"));
	}

}
