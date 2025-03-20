package com.ssafy.ddingga.presentation.user;


import com.ssafy.ddingga.facade.user.dto.SignUpRequestDto;
import com.ssafy.ddingga.facade.user.dto.SignUpResponseDto;
import com.ssafy.ddingga.facade.user.service.UserFacadeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * 사용자 관련 API 엔드포인트를 처리하는 컨트롤러
 */
@Tag(name = "User", description = "사용자 API")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserFacadeService userFacadeService;


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
        SignUpResponseDto response = userFacadeService.signUp(request);
        return ResponseEntity.ok(response);
    }

}
