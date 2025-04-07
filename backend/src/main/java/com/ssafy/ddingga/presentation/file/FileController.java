package com.ssafy.ddingga.presentation.file;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.ssafy.ddingga.global.service.S3Service;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "FileUpload", description = "S3에 이미지 또는 동영상 파일 업로드")
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {
	private final S3Service s3Service;

	@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public String uploadFile(
		@RequestPart(value = "file", required = false)
		// multipart/form-data에서 profileImage 파일을 받음
		@Parameter(
			description = "프로필 이미지 파일",
			content = @Content(
				mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
				schema = @Schema(type = "string", format = "binary")
			)
		) MultipartFile file) {
		try {
			return s3Service.uploadFile(file);
		} catch (IOException e) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "파일 업로드 실패", e);
		}
	}
}
