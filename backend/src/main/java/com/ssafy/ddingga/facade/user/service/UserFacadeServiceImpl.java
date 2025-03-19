package com.ssafy.ddingga.facade.user.service;


import com.ssafy.ddingga.domain.user.service.UserService;
import com.ssafy.ddingga.facade.user.dto.SignUpRequestDto;
import com.ssafy.ddingga.facade.user.dto.SignUpResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserFacadeServiceImpl implements UserFacadeService {
    private final UserService userService;

    @Override
    public SignUpResponseDto signUp(SignUpRequestDto request) {
        return userService.signUp(request);
    }
}
