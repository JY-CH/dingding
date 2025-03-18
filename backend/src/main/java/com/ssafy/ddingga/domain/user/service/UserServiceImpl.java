package com.ssafy.ddingga.domain.user.service;


import com.ssafy.ddingga.domain.user.entity.User;
import com.ssafy.ddingga.domain.user.repository.UserRepository;
import com.ssafy.ddingga.facade.user.dto.UserCreateRequestDto;
import com.ssafy.ddingga.facade.user.dto.UserCreateResponseDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserCreateResponseDto signUp(UserCreateRequestDto request) {
        // 중복 검사
        if (userRepository.existsByUserId(request.getUserId())) {
            throw new RuntimeException("이미 사용중인 아이디 입니다.");
        }
        // entity 생성 및 저장
        return userRepository.save(User.builder()
                .userId(userId)
                .password(passwordEncoder.encode(password))
                .username(username)
                .profileImage(profileImage)
                .createAt(LocalDateTime.now())
                .isDeleted(false)
                .build());
        //entity -> DTO 변환

    }
}
