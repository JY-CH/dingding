package com.ssafy.ddingga.presentation.user;


import java.time.Duration;

import io.swagger.v3.oas.annotations.media.Schema;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.ddingga.domain.user.entity.User;
import com.ssafy.ddingga.facade.user.dto.LoginRequestDto;
import com.ssafy.ddingga.facade.user.dto.LoginResponseDto;
import com.ssafy.ddingga.facade.user.dto.LogoutResponseDto;
import com.ssafy.ddingga.facade.user.dto.RefreshTokenRequestDto;
import com.ssafy.ddingga.facade.user.dto.SignUpRequestDto;
import com.ssafy.ddingga.facade.user.dto.SignUpResponseDto;
import com.ssafy.ddingga.facade.user.dto.TokenResponseDto;
import com.ssafy.ddingga.facade.user.dto.UserUpdateRequestDto;
import com.ssafy.ddingga.facade.user.dto.UserUpdateResponseDto;
import com.ssafy.ddingga.facade.user.service.UserFacadeService;
import com.ssafy.ddingga.global.security.jwt.JwtProperties;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;


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
    private final Logger logger = LoggerFactory.getLogger(this.getClass()); // 로거 추가
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
    public ResponseEntity<SignUpResponseDto> signUp(@RequestBody SignUpRequestDto request) {
        // 회원가입 로직 호출
        SignUpResponseDto response = userFacadeService.signUp(request);
        return ResponseEntity.ok()
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

    /**
     * 회원 정보 수정 API
     *
     * @param user 현재 로그인한 사용자 정보 (JWT 토큰에서 추출)
     * @param username 변경할 사용자 이름 (선택사항)
     * @param profileImage 변경할 프로필 이미지 파일 (선택사항)
     * @return 수정된 회원 정보
     */
    @Operation(summary = "회원 정보 수정", description = "회원의 이름과 프로필 이미지를 수정합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "회원 정보 수정 성공"),
            @ApiResponse(responseCode = "400", description = "필수 정보가 누락되었습니다."),
            @ApiResponse(responseCode = "401", description = "인증되지 않은 사용자"),
            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없음")
    })
    // consumes: 이 API가 multipart/form-data 형식의 요청을 처리함을 명시
    // 파일 업로드를 위해 필요한 설정
    @PutMapping(value = "/profile",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserUpdateResponseDto> updateProfile(
            @AuthenticationPrincipal User user,    // 현재 로그인한 사용자 정보를 JWT 토큰에서 추출
            // Spring Security가 자동으로 처리
            @RequestPart(value = "username", required = false) String username,
            // multipart/form-data에서 username 필드를 받음
            // required = false: 필수값이 아님
            @RequestPart(value = "profileImage", required = false)
            // multipart/form-data에서 profileImage 파일을 받음
            @Parameter(
                    description = "프로필 이미지 파일",
                    content = @Content(
                            mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                            schema = @Schema(type = "string", format = "binary")
                    )
            ) MultipartFile profileImage    // Swagger 에서 파일 업로드 필드가 올바르게 표시되도록 설정 실제 성능과 관계 x
            // description: 파라미터 설명
            // content: 파일 형식 지정
            // schema: 파일이 binary 형식임을 명시
    ){
        // 요청 데이터를 DTO로 변환
        UserUpdateRequestDto request = new UserUpdateRequestDto();
        request.setUsername(username);
        request.setProfileImage(profileImage);

        // 서비스 계층을 통해 사용자 정보 업데이트
        UserUpdateResponseDto response = userFacadeService.updateUserInfo(user.getUserId(), request);

        return ResponseEntity.ok(response);
    }



}
