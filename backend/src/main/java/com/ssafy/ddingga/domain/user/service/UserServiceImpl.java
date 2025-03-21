package com.ssafy.ddingga.domain.user.service;


import com.ssafy.ddingga.domain.user.entity.User;
import com.ssafy.ddingga.domain.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

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

    @Value("{spring,file,upload-dir}")
    private String uploadDir;


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


    @Override
    @Transactional
    public User updateUser(String userId, String username, MultipartFile profileImage){

        // 1. 사용자 찾기
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 2.이름 업데이트(이름이 제공된 경우에만)
        if (username != null && !username.trim().isEmpty()) {
            user.setUsername(username);
        }

        // 3. 프로필 이미지 업데이트(이미지가 제공된 경우에만)
        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                // 3-1. 업로드 디렉토리 생성
                File uploadPath = new File(uploadDir);
                if (!uploadPath.exists()) {
                    uploadPath.mkdirs();
                }
                // 3-2. 파일 이름 생성(UUID 사용하여 중복 방지)
                String originalFilename = profileImage.getOriginalFilename();
                String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
                String fileName = UUID.randomUUID().toString() + fileExtension;

                // 3-3. 파일 저장
                Path targetLocation = uploadPath.toPath().resolve(fileName);
                Files.copy(profileImage.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

                // 3-4. 이전 프로필 이미지 삭제(있는경우)
                String previousImagePath = user.getProfileImage();
                if (previousImagePath != null && !previousImagePath.equals("profileImg")) { // 차후 하드코딩 해제시 바꿀것
                    try {
                        Path previousImage = Paths.get(uploadDir, previousImagePath.substring(previousImagePath.lastIndexOf("/")+1));
                        Files.deleteIfExists(previousImage);
                    } catch (IOException e) {
                        // 이전 이미지 삭제 실패는 로그만 남기고 계속 진행
                        System.out.println("이전 프로필 삭제 실패 : " + e.getMessage());
                    }
                }
                // 3-5. 새 이미지 경로 저장
                user.setProfileImage("/uploads/"+fileName);
            } catch (IOException e) {
                throw new RuntimeException("프로필 이미지 저장에 실패했습니다.",e);
            }
        }

        // 변경사항 저장
        return userRepository.save(user);
    }


}
