package com.ssafy.ddingga.presentation.user;


import com.ssafy.ddingga.facade.user.dto.SignUpRequestDto;
import com.ssafy.ddingga.facade.user.dto.SignUpResponseDto;
import com.ssafy.ddingga.facade.user.service.UserFacadeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


/**
 * 사용자 관련 API 엔드포인트를 처리하는 컨트롤러
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserConroller {

    private final UserFacadeService userFacadeService;

    @PostMapping("/signup")
    public ResponseEntity<SignUpResponseDto> SignUp(@RequestBody SignUpRequestDto request) {
        SignUpResponseDto response = userFacadeService.signUp(request);
        return ResponseEntity.ok(response);
    }

}
