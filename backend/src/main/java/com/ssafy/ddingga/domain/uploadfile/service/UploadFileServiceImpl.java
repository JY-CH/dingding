package com.ssafy.ddingga.domain.uploadfile.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.domain.auth.service.AuthService;
import com.ssafy.ddingga.domain.uploadfile.entity.UploadFile;
import com.ssafy.ddingga.domain.uploadfile.repository.UploadFileRepository;
import com.ssafy.ddingga.global.service.S3Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j //로그를 위한 어노테이션
@Service
@RequiredArgsConstructor // final 필드나 @NonNull이 붙은 필드를 매개변수로 받는 생성자를 자동으로 생성해주는 어노테이션
public class UploadFileServiceImpl implements UploadFileService {
	private final UploadFileRepository uploadFileRepository;
	private final AuthService authService;
	private final S3Service s3Service;

	@Override
	public List<UploadFile> getUploadFile() {
		return uploadFileRepository.findAll();
	}

	@Override
	public UploadFile createUploadFile(int userId, String title, MultipartFile multipartFile) throws IOException {

		User user = authService.getUser(userId);
		String url = s3Service.uploadFile(multipartFile);

		UploadFile uploadFile = UploadFile.builder()
			.user(user)
			.title(title)
			.fileUrl(url)
			.build();

		return uploadFileRepository.save(uploadFile);
	}
}
