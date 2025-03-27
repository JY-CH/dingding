package com.ssafy.ddingga.domain.auth.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.domain.auth.repository.AuthRepository;
import com.ssafy.ddingga.global.error.exception.DuplicateException;
import com.ssafy.ddingga.global.error.exception.FileUploadException;
import com.ssafy.ddingga.global.error.exception.InvalidPasswordException;
import com.ssafy.ddingga.global.error.exception.UserAlreadyDeletedException;
import com.ssafy.ddingga.global.error.exception.UserNotFoundException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 사용자 관련 서비스 구현체
 * 회원가입, 로그인 등의 사용자 관련 비즈니스 로직을 처리
 */
@Slf4j //로그를 위한 어노테이션
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	/**
	 * 사용자 데이터 베이스 접근을 위한 레포지토리
	 * final로 선언되며 생성자 주입으로 초기화됨
	 */
	private final AuthRepository authRepository;

	/**
	 * 비밀번호 암호화를 위한 인코더
	 * spring Security에서 제공하는 passwordEncoder 사용
	 */
	private final PasswordEncoder passwordEncoder;

	@Value("${spring.file.upload-dir}")
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
	public User registerUser(String loginId, String password, String username) {
		log.info("회원가입 시도 - loginId: {}, username: {}", loginId, username);
		
		// 중복 검사
		if (authRepository.existsByLoginId(loginId)) {
			log.error("회원가입 실패 - 중복된 아이디: {}", loginId);
			throw new DuplicateException("이미 사용중인 아이디 입니다.");
		}
		
		// entity 생성
		User user = User.builder()
			.loginId(loginId)                        // 사용자 ID
			.password(passwordEncoder.encode(password))    // 비밀번호 암호화
			.username(username)                    // 사용자 이름
			.profileImage("profileImg")                        // 임시 프로필 이미지
			// .profileImage(getRandomProfileImage())  // 무작위 프로필 이미지 설정
			.createAt(LocalDateTime.now())                      // 생성 시간
			.isDeleted(false)                                   // 삭제 여부
			.build();

		// 저장
		User savedUser = authRepository.save(user);
		log.info("회원가입 성공 - userId: {}, loginId: {}", savedUser.getUserId(), savedUser.getLoginId());
		return savedUser;
	}

	@Override
	public User authenticateUser(String loginId, String password) {
		log.info("로그인 시도 - loginId: {}", loginId);
		User user = authRepository.findByLoginId(loginId)
			.orElseThrow(() -> {
				log.error("사용자를 찾을 수 없음 - loginId: {}", loginId);
				return new UserNotFoundException("사용자를 찾을 수 없습니다,..");
			});
		log.info("사용자 찾음 - userId: {}, loginId: {}", user.getUserId(), user.getLoginId());

		if (!passwordEncoder.matches(password, user.getPassword())) {
			log.error("비밀번호 불일치 - loginId: {}", loginId);
			throw new InvalidPasswordException("비밀번호가 일치하지 않습니다");
		}
		if (user.getIsDeleted()) {
			log.error("탈퇴한 계정 - loginId: {}", loginId);
			throw new UserAlreadyDeletedException("탈퇴한 계정입니다.");
		}
		log.info("로그인 성공 - userId: {}, loginId: {}", user.getUserId(), user.getLoginId());
		return user;
	}

	@Override
	@Transactional
	public User updateUser(Integer userId, String username, MultipartFile profileImage) {
		log.info("사용자 정보 수정 요청 - userId: {}, username: {}", userId, username);
		
		// 1. 사용자 찾기
		User user = authRepository.findByUserId(userId)
			.orElseThrow(() -> {
				log.error("사용자를 찾을 수 없음 - userId: {}", userId);
				return new UserNotFoundException("사용자를 찾을 수 없습니다.");
			});

		// 2.이름 업데이트(이름이 제공된 경우에만)
		if (username != null && !username.trim().isEmpty()) {
			log.info("사용자 이름 수정 - userId: {}, oldName: {}, newName: {}", 
				userId, user.getUsername(), username);
			user.setUsername(username);
		}

		// 3. 프로필 이미지 업데이트(이미지가 제공된 경우에만)
		if (profileImage != null && !profileImage.isEmpty()) {
			log.info("프로필 이미지 수정 시작 - userId: {}", userId);
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
						Path previousImage = Paths.get(uploadDir,
							previousImagePath.substring(previousImagePath.lastIndexOf("/") + 1));
						Files.deleteIfExists(previousImage);
					} catch (IOException e) {
						// 이전 이미지 삭제 실패는 로그만 남기고 계속 진행
						log.error("이전 프로필 이미지 삭제 실패: {}", e.getMessage());
					}
				}
				// 3-5. 새 이미지 경로 저장
				String newImagePath = "/uploads/" + fileName;
				log.info("프로필 이미지 수정 완료 - userId: {}, newImagePath: {}", userId, newImagePath);
				user.setProfileImage(newImagePath);
			} catch (IOException e) {
				log.error("프로필 이미지 업로드 실패 - userId: {}, error: {}", userId, e.getMessage());
				throw new FileUploadException("프로필 이미지 저장에 실패했습니다.", e);
			}
		}

		// 변경사항 저장
		User updatedUser = authRepository.save(user);
		log.info("사용자 정보 수정 완료 - userId: {}", userId);
		return updatedUser;
	}

	@Override
	@Transactional
	public User deleteUser(Integer userId) {
		log.info("회원 탈퇴 요청 - userId: {}", userId);

		User user = authRepository.findByUserId(userId)
			.orElseThrow(() -> {
				log.error("사용자를 찾을 수 없음 - userId: {}", userId);
				return new UserNotFoundException("사용자를 찾을 수 없습니다.");
			});

		if (user.getIsDeleted()) {
			log.error("이미 탈퇴한 계정 - userId: {}", userId);
			throw new UserAlreadyDeletedException("이미 탈퇴한 계정입니다.");
		}

		user.setIsDeleted(true);
		User deletedUser = authRepository.save(user);
		log.info("회원 탈퇴 완료 - userId: {}", userId);
		return deletedUser;
	}

	@Override
	public User getUser(int userId) {
		log.info("사용자 정보 조회 요청 - userId: {}", userId);
		
		User user = authRepository.findByUserId(userId)
			.orElseThrow(() -> {
				log.error("사용자를 찾을 수 없음 - userId: {}", userId);
				return new UserNotFoundException("사용자를 찾을 수 없습니다.");
			});
			
		log.info("사용자 정보 조회 완료 - userId: {}, loginId: {}", userId, user.getLoginId());
		return user;
	}
}
