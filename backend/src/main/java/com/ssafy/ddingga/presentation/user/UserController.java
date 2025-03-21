package com.ssafy.ddingga.presentation.user;


import com.ssafy.ddingga.facade.user.dto.*;
import com.ssafy.ddingga.facade.user.service.UserFacadeService;
import com.ssafy.ddingga.global.security.jwt.JwtProperties;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;


/**
 * 사용자 관련 API 엔드포인트를 처리하는 컨트롤러
 */
@Tag(name = "User", description = "사용자 API")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserFacadeService userFacadeService;
    private final JwtProperties jwtProperties;


    /**
     * 회원가입 Api
     * 새로운 사용자를 등록하고 JWT토큰을 발급
     * @param request 회원가입 요청 데이터
     * @return JWT 토큰이 포함된 회원가입 응답.
     */
    @Operation(summary = "회원가입", description = "새로운 사용자를 등록하고 JWT 토큰을 발급한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "회원가입 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "409", description = "이미 존재하는 사용자")

    })
    @PostMapping("/signup")
    public ResponseEntity<SignUpResponseDto> SignUp(@RequestBody SignUpRequestDto request) {
        // 회원가입 로직 호출
        SignUpResponseDto response = userFacadeService.signUp(request);
        // 리프레시 토큰을 쿠키에 설정
        ResponseCookie cookie = ResponseCookie.from("refreshToken", response.getRefreshToken())
                .httpOnly(true)
                .secure(true) // https 환경에서는 true로 설정
                .sameSite("Strict")
                .maxAge(Duration.ofSeconds(jwtProperties.getRefreshTokenExpiration()))
                .path("/api/auth")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
    }

    /**
     * 로그인 API
     * 사용자 인증 및 JWT 토큰 발급
     * @param request 로그인 요청 데이터
     * @return JWT 토큰이 포함된 로그인 응답
     */
    @Operation(summary = "로그인", description = "사용자 인증 후 JWT 토큰을 발급합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "로그인 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto request) {
        // 로그인 처리
        LoginResponseDto response = userFacadeService.login(request);

        // 리프레시 토큰을 쿠키에 설정
        ResponseCookie cookie = ResponseCookie.from("refreshToken", response.getRefreshToken())
            .httpOnly(true)
            .secure(true)
            .sameSite("Strict")
            .maxAge(Duration.ofSeconds(jwtProperties.getRefreshTokenExpiration()))
            .path("/api/auth")
            .build();
        
        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, cookie.toString())
            .body(response);
    }

    /**
     * 리프레시 토큰을 사용해 새로운 엑세스 토큰과 리프레시 토큰을 발급
     * @param  refreshToken 리프레시 토큰을 담은 요청 객체
     * @return 새로 발급된 엑세스 토큰과 리프레시 토큰
     */

    @Operation(summary = "토큰 갱신", description = "리프레시 토큰을 사용해 새로운 엑세스 토큰과 리프레시 토큰을 발급")
    @ApiResponses({
            @ApiResponse(responseCode ="200", description = "토큰 갱신 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청"),
            @ApiResponse(responseCode = "401", description = "유효하지 않은 리프레시 토큰")
    })
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponseDto> refreshToken(
        @CookieValue(name = "refreshToken", required = false) String refreshToken,
        @RequestBody(required = false) RefreshTokenRequestDto requestDto) {

            if (refreshToken == null && requestDto == null) {
                throw new RuntimeException("리프레시 토큰이 없습니다.");
            }
        TokenResponseDto tokenResponse = userFacadeService.refreshToken(refreshToken);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", tokenResponse.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .maxAge(Duration.ofSeconds(jwtProperties.getRefreshTokenExpiration()))
                .path("/api/auth")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(tokenResponse);
    }

    @Operation(summary = "로그아웃", description = "사용자 로그아웃 처리 및 JWT 토큰 무효화")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "로그아웃 성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패")
    })
    @PostMapping("/logout")
    public ResponseEntity<LogoutResponseDto> logout (
            @RequestHeader(value = HttpHeaders.AUTHORIZATION) String authorizationHeader) {

        // Bearer 접두사 제거
        String token = authorizationHeader.replace(jwtProperties.getTokenPrefix(), "");

        // 로그아웃 처리
        LogoutResponseDto response = userFacadeService.logout(token);

        // 리프레시 토큰 쿠키 제거
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .maxAge(0) // 쿠키 즉시 만료
                .path("/api/auth")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);

    }


}
