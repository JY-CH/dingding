package com.ssafy.ddingga.global.error;



import com.ssafy.ddingga.global.error.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@RestControllerAdvice
public class GlobalExceptionHandler {

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
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateException(RuntimeException e) {
        if (e.getMessage().contains("이미 사용중인 아이디")) {
            ErrorResponse response = new ErrorResponse(
                    e.getMessage(),
                    "Conflict",
                    HttpStatus.CONFLICT.value()
            );
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
        throw e; // 다른 RuntimeException은 기본 핸들러로 전달
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
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleNotFoundException(RuntimeException e) {
        if (e.getMessage().contains("사용자를 찾을 수 없습니다")) {
            ErrorResponse response = new ErrorResponse(
                    e.getMessage(),
                    "Not Found",
                    HttpStatus.NOT_FOUND.value()
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
        throw e; // 다른 RuntimeException은 기본 핸들러로 전달
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
}