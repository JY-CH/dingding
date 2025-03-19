package com.ssafy.ddingga.facade.user.service;

import com.ssafy.ddingga.facade.user.dto.SignUpRequestDto;
import com.ssafy.ddingga.facade.user.dto.SignUpResponseDto;

public interface UserFacadeService {
    SignUpResponseDto signUp(SignUpRequestDto request);
}
