package com.ssafy.ddingga.presentation.article;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ddingga.domain.user.entity.User;
import com.ssafy.ddingga.facade.article.dto.request.ArticleCreateRequestDto;
import com.ssafy.ddingga.facade.article.dto.response.ArticleGetAllResponseDto;
import com.ssafy.ddingga.facade.article.service.ArticleFacadeService;
import com.sun.jdi.request.InvalidRequestStateException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

/**
 * 게시판 관련 API 엔드포인트를 처리하는 컨트롤러
 */
@Tag(name = "Article", description = "게시판 API")
@RestController
@RequestMapping("/api/article")
@RequiredArgsConstructor
public class ArticleController {

	private final ArticleFacadeService articleFacadeService;

	/**
	 * 게시판 목록 전체조회 Api
	 * @return 게시판 전체 목록
	 */
	@Operation(summary = "게시판", description = "모든 게시글을 조회합니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "게시판 조회 성공"),
		@ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 게시판입니다.")
	})
	@GetMapping(value = "/")
	public ResponseEntity<List<ArticleGetAllResponseDto>> articleGetALL() {
		try {
			// 게시판 전체 조회 로직 호출
			List<ArticleGetAllResponseDto> response = articleFacadeService.articlesGetAll();
			return ResponseEntity.ok().body(response);
		} catch (Exception e) {
			// 예외가 발생하면 500 Internal Server Error 응답 반환
			return ResponseEntity.status(500).body(null); // 또는 로그를 남기고 적절한 응답을 반환
		}
	}

	/**
	 * 게시글 생성 Api
	 * @return 게시판 전체 목록
	 */
	@Operation(summary = "게시판", description = "게시글을 생성합니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "201", description = "게시글 생성 성공"),
		@ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 게시판입니다.")
	})
	@PostMapping(value = "/")
	public ResponseEntity<Void> articleCreate(@AuthenticationPrincipal User user,
		@RequestBody ArticleCreateRequestDto article) {
		try {
			articleFacadeService.articleCreate(user.getUserId(), article);

			return ResponseEntity.ok().build();    // 응답 본문 없이 상태 코드만 반환
		} catch (InvalidRequestStateException e) {
			return ResponseEntity.badRequest().build(); // 잘못된 요청
		}
	}
}
