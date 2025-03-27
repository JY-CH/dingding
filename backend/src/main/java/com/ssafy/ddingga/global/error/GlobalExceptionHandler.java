package com.ssafy.ddingga.global.error;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import com.ssafy.ddingga.global.error.dto.ErrorResponse;
import com.ssafy.ddingga.global.error.exception.DatabaseException;
import com.ssafy.ddingga.global.error.exception.DuplicateException;
import com.ssafy.ddingga.global.error.exception.FileUploadException;
import com.ssafy.ddingga.global.error.exception.InvalidPasswordException;
import com.ssafy.ddingga.global.error.exception.InvalidTokenException;
import com.ssafy.ddingga.global.error.exception.NotFoundException;
import com.ssafy.ddingga.global.error.exception.ServiceException;
import com.ssafy.ddingga.global.error.exception.TokenExpiredException;
import com.ssafy.ddingga.global.error.exception.UserAlreadyDeletedException;
import com.ssafy.ddingga.global.error.exception.UserNotFoundException;
import com.ssafy.ddingga.global.error.exception.UserSocialNotfoundException;

@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)  // 우선순위 추가
public class GlobalExceptionHandler {

	/**
	 * 기타 예외 처리 (500 Internal Server Error)
	 */
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleException(Exception e) {
		ErrorResponse response = new ErrorResponse(
			"서버 내부 오류가 발생했습니다.",
			"Internal Server Error",
			HttpStatus.INTERNAL_SERVER_ERROR.value()
		);
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
	}

	/**
	 * 인증 관련 예외 처리 (401 Unauthorized)
	 */
	@ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException e) {
		ErrorResponse response = new ErrorResponse(
			"인증되지 않은 사용자입니다.",
			"Unauthorized",
			HttpStatus.UNAUTHORIZED.value()
		);
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	}

	/**
	 * 권한 관련 예외 처리 (403 Forbidden)
	 */
	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException e) {
		ErrorResponse response = new ErrorResponse(
			"접근 권한이 없습니다.",
			"Forbidden",
			HttpStatus.FORBIDDEN.value()
		);
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
	}

	/**
	 * 중복 데이터 예외 처리 (409 Conflict)
	 */
	@ExceptionHandler(DuplicateException.class)
	public ResponseEntity<ErrorResponse> handleDuplicateException(DuplicateException e) {
		ErrorResponse response = new ErrorResponse(
			e.getMessage(),
			"Conflict",
			HttpStatus.CONFLICT.value()
		);
		return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
	}

	/**
	 * 잘못된 요청 예외 처리 (400 Bad Request)
	 */
	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException e) {
		ErrorResponse response = new ErrorResponse(
			e.getMessage(),
			"Bad Request",
			HttpStatus.BAD_REQUEST.value()
		);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	}

	/**
	 * 리소스를 찾을 수 없는 예외 처리 (404 Not Found)
	 */
	@ExceptionHandler(NotFoundException.class)
	public ResponseEntity<ErrorResponse> handleNotFoundException(NotFoundException e) {
		ErrorResponse response = new ErrorResponse(
			e.getMessage(),
			"Not Found",
			HttpStatus.NOT_FOUND.value()
		);
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	}

	/**
	 * 파일 크기 초과 예외 처리 (413 Payload Too Large)
	 */
	@ExceptionHandler(MaxUploadSizeExceededException.class)
	public ResponseEntity<ErrorResponse> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException e) {
		ErrorResponse response = new ErrorResponse(
			"파일 크기가 너무 큽니다. (최대 10MB)",
			"Payload Too Large",
			HttpStatus.PAYLOAD_TOO_LARGE.value()
		);
		return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(response);
	}

	@ExceptionHandler(UserNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleUserNotFoundException(UserNotFoundException e) {
		ErrorResponse response = new ErrorResponse(
			e.getMessage(),
			"USER_NOT_FOUND",
			HttpStatus.NOT_FOUND.value()

		);
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	}

	@ExceptionHandler(UserAlreadyDeletedException.class)
	public ResponseEntity<ErrorResponse> handleUserAlreadyDeletedException(UserAlreadyDeletedException e) {
		ErrorResponse response = new ErrorResponse(
			e.getMessage(),
			"USER_ALREADY_DELETED",
			HttpStatus.BAD_REQUEST.value()
		);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	}

	@ExceptionHandler(FileUploadException.class)
	public ResponseEntity<ErrorResponse> handleFileUploadException(FileUploadException e) {
		ErrorResponse response = new ErrorResponse(
			e.getMessage(),
			"파일 업로드 에러",
			HttpStatus.INTERNAL_SERVER_ERROR.value()
		);
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
	}

	@ExceptionHandler(InvalidPasswordException.class)
	public ResponseEntity<ErrorResponse> handleInvalidPasswordException(InvalidPasswordException e) {
		ErrorResponse response = new ErrorResponse(
			e.getMessage(),
			"INVALID_PASSWORD",
			HttpStatus.UNAUTHORIZED.value()
		);
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	}

	@ExceptionHandler(InvalidTokenException.class)
	public ResponseEntity<ErrorResponse> handleInvalidTokenException(InvalidTokenException e) {
		ErrorResponse response = new ErrorResponse(
			e.getMessage(),
			"INVALID_TOKEN",
			HttpStatus.UNAUTHORIZED.value()
		);
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	}

	@ExceptionHandler(TokenExpiredException.class)
	public ResponseEntity<ErrorResponse> handleTokenExpiredException(TokenExpiredException e) {
		ErrorResponse response = new ErrorResponse(
			e.getMessage(),
			"TOKEN_EXPIRED",
			HttpStatus.UNAUTHORIZED.value()
		);
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	}

	@ExceptionHandler(UserSocialNotfoundException.class)
	public ResponseEntity<ErrorResponse> handleUserSocialNotFoundException(UserSocialNotfoundException e) {
		ErrorResponse response = new ErrorResponse(
			e.getMessage(),
			"USER_SOCIAL_NOT_FOUND",
			HttpStatus.NOT_FOUND.value()
		);
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	}

	/**
	 * 데이터베이스 관련 예외 처리 (500 Internal Server Error)
	 */
	@ExceptionHandler(DatabaseException.class)
	public ResponseEntity<ErrorResponse> handleDatabaseException(DatabaseException e) {
		ErrorResponse response = new ErrorResponse(
			e.getMessage(),
			"Database Error",
			HttpStatus.INTERNAL_SERVER_ERROR.value()
		);
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
	}

	/**
	 * 서비스 레이어 예외 처리 (500 Internal Server Error)
	 */
	@ExceptionHandler(ServiceException.class)
	public ResponseEntity<ErrorResponse> handleServiceException(ServiceException e) {
		ErrorResponse response = new ErrorResponse(
			e.getMessage(),
			"Service Error",
			HttpStatus.INTERNAL_SERVER_ERROR.value()
		);
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
	}
}