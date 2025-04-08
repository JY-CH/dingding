package com.ssafy.ddingga.facade.uploadfile.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ssafy.ddingga.domain.uploadfile.entity.UploadFile;
import com.ssafy.ddingga.domain.uploadfile.service.UploadFileService;
import com.ssafy.ddingga.facade.uploadfile.dto.response.GetUploadFileResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UploadFileFacadeServiceImpl implements UploadFileFacadeService {
	private final UploadFileService uploadFileService;

	@Override
	public List<GetUploadFileResponseDto> getUploadFile() {
		List<UploadFile> uploadFiles = uploadFileService.getUploadFile();
		List<GetUploadFileResponseDto> responseDto = new ArrayList<>();

		for (UploadFile uploadFile : uploadFiles) {
			GetUploadFileResponseDto getUploadFileResponseDto = GetUploadFileResponseDto.builder()
				.username(uploadFile.getUser().getUsername())
				.title(uploadFile.getTitle())
				.fileUrl(uploadFile.getFileUrl())
				.build();

			responseDto.add(getUploadFileResponseDto);
		}

		return responseDto;
	}

	@Override
	public void createUploadFile(int userId, String title, MultipartFile file) throws IOException {
		uploadFileService.createUploadFile(userId, title,
			file);
		// uploadFileService.createUploadFile(userId, createUploadFileRequestDto.getTitle(),
		// 	createUploadFileRequestDto.getMultipartFile());
	}
}
