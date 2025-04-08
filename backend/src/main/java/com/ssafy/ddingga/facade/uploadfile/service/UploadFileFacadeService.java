package com.ssafy.ddingga.facade.uploadfile.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.ssafy.ddingga.facade.uploadfile.dto.response.GetUploadFileResponseDto;

public interface UploadFileFacadeService {
	List<GetUploadFileResponseDto> getUploadFile();

	void createUploadFile(int userId, String title, MultipartFile file) throws IOException;
}
