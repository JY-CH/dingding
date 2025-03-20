package com.ssafy.ddingga.domain.user.service;


import com.ssafy.ddingga.domain.user.entity.User;
import com.ssafy.ddingga.domain.user.repository.UserRepository;
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


    @Override
    @Transactional
    public User registerUser(String userId, String password, String username){

        // 중복 검사
        if (userRepository.existsByUserId(userId)) {
            throw new RuntimeException("이미 사용중인 아이디 입니다.");
        }
        // entity 생성
        User user =  User.builder()
                .userId(userId)                        // 사용자 ID
                .password(passwordEncoder.encode(password))    // 비밀번호 암호화
                .username(username)                    // 사용자 이름
                .profileImage("profileimg")                        // 임시 프로필 이미지
                // .profileImage(getRandomProfileImage())  // 무작위 프로필 이미지 설정
                .createAt(LocalDateTime.now())                      // 생성 시간
                .isDeleted(false)                                   // 삭제 여부
                .build();

        // 저장
        return userRepository.save(user);
    }

    @Override
    public User authenticateUser(String userId, String password) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다,.."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다");
        }
        if (user.getIsDeleted()) {
            throw new RuntimeException("탈퇴한 계정입니다.");
        }
        return user;
    }

}
