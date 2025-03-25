package com.ssafy.ddingga.presentation.article;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ddingga.facade.article.dto.response.ArticleGetAllResponseDto;
import com.ssafy.ddingga.facade.article.service.ArticleFacadeService;

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
		// 게시판 전체 조회 로직 호출
		List<ArticleGetAllResponseDto> response = articleFacadeService.articlesGetAll();
		return ResponseEntity.ok()
			.body(response);
	}
}
