package com.ssafy.ddingga.domain.user.service;


import com.ssafy.ddingga.domain.user.entity.User;
import com.ssafy.ddingga.domain.user.repository.UserRepository;
import com.ssafy.ddingga.facade.user.dto.SignUpRequestDto;
import com.ssafy.ddingga.facade.user.dto.SignUpResponseDto;
import com.ssafy.ddingga.facade.user.dto.TokenResponseDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

/**
 * 사용자 관련 서비스 구현체
 * 회원가입, 로그인 등의 사용자 관련 비즈니스 로직을 처리
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    /**
     * 사용자 데이터 베이스 접근을 위한 레포지토리
     * final로 선언되며 생성자 주입으로 초기화됨
     */
    private final UserRepository userRepository;

    /**
     * 비밀번호 암호화를 위한 인코더
     * spring Security에서 제공하는 passwordEncoder 사용
     */
    private final PasswordEncoder passwordEncoder;

    /**
     * JWT 토큰 생성 및 검증을 위한 서비스
     */
    private final JwtService jwtService;

    // // 프로필 이미지 URL 배열
    // private static final String[] PROFILE_IMAGES = {
    //     "https://example.com/profile1.jpg",
    //     "https://example.com/profile2.jpg",
    //     "https://example.com/profile3.jpg",
    //     "https://example.com/profile4.jpg",
    //     "https://example.com/profile5.jpg"
    // };

    // // 무작위 프로필 이미지 선택 메서드
    // private String getRandomProfileImage() {
    //     Random random = new Random();
    //     return PROFILE_IMAGES[random.nextInt(PROFILE_IMAGES.length)];
    // }

    /**
     * 회원가입 처리 메서드
     *
     * @param request 회원가입 요청 데이터 (SignUpRequestDto)
     * @return 회원가입 응답 데이터 (SignUpResponseDto)
     * @throws RuntimeException 사용자 ID가 이미 존재하는 경우
     */
    @Override
    @Transactional  // 트랜잭션 관리
    public SignUpResponseDto signUp(SignUpRequestDto request) {
        // 중복 검사
        if (userRepository.existsByUserId(request.getUserId())) {
            throw new RuntimeException("이미 사용중인 아이디 입니다.");
        }
        // entity 생성
        User user =  User.builder()
                .userId(request.getUserId())                        // 사용자 ID
                .password(passwordEncoder.encode(request.getPassword()))    // 비밀번호 암호화
                .username(request.getUserName())                    // 사용자 이름
                .profileImage("profileimg")                        // 임시 프로필 이미지
                // .profileImage(getRandomProfileImage())  // 무작위 프로필 이미지 설정
                .createAt(LocalDateTime.now())                      // 생성 시간
                .isDeleted(false)                                   // 삭제 여부
                .build();

        // 저장
        User savedUser = userRepository.save(user);

        // JWT 토큰 생성
        TokenResponseDto tokens = jwtService.issueToken(savedUser);

        // 응답 DTO 생성
        return SignUpResponseDto.from(savedUser, tokens);

    }
}
