package com.ssafy.ddingga.domain.user.service;

import com.ssafy.ddingga.facade.user.dto.UserCreateRequestDto;
import com.ssafy.ddingga.facade.user.dto.UserCreateResponseDto;

public interface UserService {
    UserCreateResponseDto signUp(UserCreateRequestDto request);

}
