package com.ssafy.ddingga.facade.user.service;


import com.ssafy.ddingga.domain.user.entity.User;
import com.ssafy.ddingga.domain.user.service.JwtService;
import com.ssafy.ddingga.domain.user.service.UserService;
import com.ssafy.ddingga.facade.user.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserFacadeServiceImpl implements UserFacadeService {
    private final UserService userService;
    private final JwtService jwtService;

    @Override
    public SignUpResponseDto signUp(SignUpRequestDto request) {
        User user = userService.registerUser(
                request.getUserId(),
                request.getPassword(),
                request.getUserName()
        );
        TokenResponseDto tokens = jwtService.issueToken(user);

        return SignUpResponseDto.from(user,tokens);
    }

    @Override
    public LoginResponseDto login(LoginRequestDto request) {
        User user = userService.authenticateUser(
                request.getUserId(),
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
    public TokenResponseDto refreshToken(String refreshToken) {
        return jwtService.refreshToken(refreshToken);
    }
}
