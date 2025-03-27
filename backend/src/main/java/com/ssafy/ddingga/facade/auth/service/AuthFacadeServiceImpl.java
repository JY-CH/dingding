package com.ssafy.ddingga.facade.auth.service;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.domain.auth.service.AuthService;
import com.ssafy.ddingga.domain.auth.service.JwtService;
import com.ssafy.ddingga.facade.auth.dto.request.LoginRequestDto;
import com.ssafy.ddingga.facade.auth.dto.request.SignUpRequestDto;
import com.ssafy.ddingga.facade.auth.dto.request.UserUpdateRequestDto;
import com.ssafy.ddingga.facade.auth.dto.response.AuthDeleteResponseDto;
import com.ssafy.ddingga.facade.auth.dto.response.AuthUpdateResponseDto;
import com.ssafy.ddingga.facade.auth.dto.response.LoginResponseDto;
import com.ssafy.ddingga.facade.auth.dto.response.LogoutResponseDto;
import com.ssafy.ddingga.facade.auth.dto.response.SignUpResponseDto;
import com.ssafy.ddingga.facade.auth.dto.response.TokenResponseDto;
import com.ssafy.ddingga.global.security.jwt.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthFacadeServiceImpl implements AuthFacadeService {
	private final AuthService authService;
	private final JwtService jwtService;
	private final JwtTokenProvider jwtTokenProvider;

	@Override
	public SignUpResponseDto signUp(SignUpRequestDto request) {
		// user 엔티티만 생성
		User user = authService.registerUser(
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
		User user = authService.authenticateUser(
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
	public AuthUpdateResponseDto updateUserInfo(Integer userId, UserUpdateRequestDto request) {
		//UserService를 통해 사용자 정보 업데이트
		User updateUser = authService.updateUser(
			userId,
			request.getUsername(),
			request.getProfileImage()
		);

		// 업데이트된 사용자 정보를 DTO로 변환하여 반환
		return AuthUpdateResponseDto.from(updateUser);
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
		Integer userId = jwtTokenProvider.getUserId(accessToken);

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

	@Override
	public AuthDeleteResponseDto deleteUser(Integer userId) {
		//회원 탈퇴 처리
		User deletedUser = authService.deleteUser(userId);
		//로그아웃과 동일하게 토큰 무효화 처리
		jwtService.invalidateRefreshToken(userId);
		// 응답 생성
		return new AuthDeleteResponseDto(
			"회원탈퇴가 완료되었습니다.",
			deletedUser.getLoginId()
		);
	}
}