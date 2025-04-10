package com.ssafy.ddingga.facade.uploadfile.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetUploadFileResponseDto {
	private String username;
	private String title;
	private String fileUrl;
}
