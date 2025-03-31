// 📌 백엔드 오류 코드 참고
// https://lab.ssafy.com/moda2047/grimtalkback/-/blob/develop/src/main/java/com/example/grimtalk/controller/common/ResponseStatus.java

// 오류 코드 타입 정의
export const ERROR_CODES = {
  // 4000번대: 클라이언트 요청 오류
  DUPLICATE_EMAIL: 4001,
  NOT_FOUND_MEMBER: 4002,
  PASSWORD_MISMATCH: 4003,
  LOGIN_FAILED: 4004,

  // 4100번대: 게시판 관련 오류
  NOT_FOUND_BOARD: 4101,
  FORBIDDEN_MODIFY_BOARD: 4102,
  FORBIDDEN_DELETE_BOARD: 4103,
  FORBIDDEN_DELETE_BOARD_COMMENT: 4104,

  // 4200번대: 강의/구독 관련 오류
  NOT_FOUND_LECTURE: 4201,
  ALREADY_SUBSCRIBED: 4201,
  NOT_ALLOWED_SELF_SUBSCRIPTION: 4202,

  // 5000번대: 인증/인가 오류
  EXPIRED_ACCESS_TOKEN: 5001,
  EXPIRED_REFRESH_TOKEN: 5002,
  INVALID_ACCESS_TOKEN: 5003,
  INVALID_REFRESH_TOKEN: 5004,
  NOT_FOUND_REFRESH_TOKEN: 5005,
  NOT_FOUND_ACCESS_TOKEN: 5006,

  // 6000번대: 시스템 오류
  FILE_UPLOAD_ERROR: 6001,
} as const;

// 오류 코드 타입 추출
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

// API 응답 객체 타입 정의
interface ApiResponse {
  data: {
    body: {
      message: string;
    };
  };
}

/**
 * API 에러 응답 처리 함수
 * @param {ApiResponse} response - API 응답 객체
 */
export const handleApiError = (response: ApiResponse): void => {
  const { message } = response.data.body;
  alert(message);
};
