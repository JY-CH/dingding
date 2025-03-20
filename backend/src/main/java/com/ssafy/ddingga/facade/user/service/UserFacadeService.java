package com.ssafy.ddingga.facade.user.service;

import com.ssafy.ddingga.facade.user.dto.*;

public interface UserFacadeService {
    SignUpResponseDto signUp(SignUpRequestDto request);
    TokenResponseDto refreshToken(String refreshToken);
    LoginResponseDto login(LoginRequestDto request);
}
