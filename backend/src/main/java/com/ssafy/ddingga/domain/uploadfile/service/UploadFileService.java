package com.ssafy.ddingga.domain.uploadfile.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.ssafy.ddingga.domain.uploadfile.entity.UploadFile;

public interface UploadFileService {
	List<UploadFile> getUploadFile();

	UploadFile createUploadFile(int userId, String title, MultipartFile multipartFile) throws IOException;
}
