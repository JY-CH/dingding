package com.ssafy.ddingga.facade.replay.dto.request;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReplayCreateRequestDto {
	private Integer songId;
	private Integer score;
	private String mode;
	private MultipartFile videoFile; // 왜 path가 아니냐 -> 프론트에선 파일로 올림(multipartFile)
	private String videoTime;
}
