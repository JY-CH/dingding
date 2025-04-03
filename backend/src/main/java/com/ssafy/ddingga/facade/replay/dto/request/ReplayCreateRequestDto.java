package com.ssafy.ddingga.facade.replay.dto.request;

import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReplayCreateRequestDto {
	// private Integer songId;
	// private Integer score;
	// private String mode;
	// private MultipartFile videoFile; // 왜 path가 아니냐 -> 프론트에선 파일로 올림(multipartFile)
	// private String videoTime;

	@Schema(description = "노래 ID", example = "1")
	private Integer songId;

	@Schema(description = "점수", example = "77")
	private Integer score;

	@Schema(description = "게임 모드", example = "HARD")
	private String mode;

	@Schema(description = "업로드할 MP4 파일", type = "string", format = "binary")
	private MultipartFile videoFile;

	@Schema(description = "비디오 재생 시간", example = "00:03:15")
	private String videoTime;
}
