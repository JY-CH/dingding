package com.ssafy.ddingga.presentation.uploadfile;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.facade.uploadfile.dto.response.CreateUploadFileResponseDto;
import com.ssafy.ddingga.facade.uploadfile.dto.response.GetUploadFileResponseDto;
import com.ssafy.ddingga.facade.uploadfile.service.UploadFileFacadeService;
import com.ssafy.ddingga.global.service.S3Service;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "FileUpload", description = "S3에 이미지 또는 동영상 파일 업로드")
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {
	private final S3Service s3Service;
	private final UploadFileFacadeService uploadFileFacadeService;

	@PostMapping(value = "/TEST", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public String uploadFile(@RequestPart(value = "file", required = false)
	// multipart/form-data에서 profileImage 파일을 받음
	@Parameter(description = "이미지, 동영상 파일", content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE, schema = @Schema(type = "string", format = "binary"))) MultipartFile file) {
		try {
			return s3Service.uploadFile(file);
		} catch (IOException e) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "파일 업로드 실패", e);
		}
	}

	@Operation(summary = "쇼츠 업로드 파일 조회", description = "쇼츠에 업로드 된 파일들을 조회합니다.")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "파일 조회 성공"),
		@ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 파일입니다.")})
	@GetMapping(value = "")
	public ResponseEntity<List<GetUploadFileResponseDto>> getUploadFile() {
		// 게시글 댓글 조회
		List<GetUploadFileResponseDto> response = uploadFileFacadeService.getUploadFile();
		return ResponseEntity.ok().body(response);
	}

	@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public CreateUploadFileResponseDto createUploadFile(@AuthenticationPrincipal User user,
		@RequestPart("title") @Parameter(description = "파일과 함께 받을 문자열 값 (예: 제목)") String title,
		@RequestPart("videoFile") @Parameter(description = "업로드할 파일 (동영상)") MultipartFile file) {
		try {
			CreateUploadFileResponseDto responseDto = new CreateUploadFileResponseDto();
			responseDto.setSuccess(uploadFileFacadeService.createUploadFile(user.getUserId(), title, file));

			return responseDto;
		} catch (IOException e) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "파일 업로드 실패", e);
		}
	}
}
