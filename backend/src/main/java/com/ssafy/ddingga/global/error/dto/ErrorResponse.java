package com.ssafy.ddingga.global.error.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
	private String message;
	private String error;
	private int status;
	private String timestamp;

	// 생성자 오버로딩
	public ErrorResponse(String message, String error, int status) {
		this.message = message;
		this.error = error;
		this.status = status;
		this.timestamp = java.time.LocalDateTime.now().toString();
	}

}
