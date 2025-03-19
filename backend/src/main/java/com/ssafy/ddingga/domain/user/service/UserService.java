package com.ssafy.ddingga.domain.user.service;

import com.ssafy.ddingga.facade.user.dto.SignUpRequestDto;
import com.ssafy.ddingga.facade.user.dto.SignUpResponseDto;

public interface UserService {
    SignUpResponseDto signUp(SignUpRequestDto request);

}
