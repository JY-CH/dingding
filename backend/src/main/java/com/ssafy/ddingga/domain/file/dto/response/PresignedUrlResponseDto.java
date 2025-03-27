package com.ssafy.ddingga.domain.file.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PresignedUrlResponseDto {
	private String presignedUrl;
	private String fileKey;
} 