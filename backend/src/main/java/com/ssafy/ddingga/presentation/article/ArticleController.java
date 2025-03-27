package com.ssafy.ddingga.presentation.article;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.facade.article.dto.request.ArticleCreateRequestDto;
import com.ssafy.ddingga.facade.article.dto.request.ArticleUpdateRequestDto;
import com.ssafy.ddingga.facade.article.dto.response.ArticleDetailResponseDto;
import com.ssafy.ddingga.facade.article.dto.response.ArticleGetAllResponseDto;
import com.ssafy.ddingga.facade.article.dto.response.ArticleSearchResponseDto;
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
	@Operation(summary = "게시글 전체 조회", description = "모든 게시글을 조회합니다.")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "게시글 전체 조회 성공"),
		@ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 게시판입니다.")})
	@GetMapping(value = "")
	public ResponseEntity<List<ArticleGetAllResponseDto>> articleGetALL() {
		// 게시판 전체 조회 로직 호출
		List<ArticleGetAllResponseDto> response = articleFacadeService.allGetArticleList();
		return ResponseEntity.ok().body(response);
	}

	/**
	 * 게시글 상세 조회 Api
	 * @param articleId 게시긓 id
	 * @return 해당 게시글 id의 게시글
	 */
	@Operation(summary = "게시글 상세 조회", description = "해당 게시글을 조회합니다.")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "게시글 조회 성공"),
		@ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 게시판입니다.")})
	@GetMapping(value = "/{articleId}")
	public ResponseEntity<ArticleDetailResponseDto> articleDetail(@PathVariable int articleId) {
		// 게시판 전체 조회 로직 호출
		ArticleDetailResponseDto response = articleFacadeService.getArticle(articleId);
		return ResponseEntity.ok().body(response);
	}

	/**
	 * 게시글 생성 Api
	 * @param request 게시글 생성 요청 데이터
	 */
	@Operation(summary = "게시글 생성", description = "게시글을 생성합니다.")
	@ApiResponses({@ApiResponse(responseCode = "201", description = "게시글 생성 성공"),
		@ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 게시판입니다.")})
	@PostMapping(value = "")
	public ResponseEntity<Void> articleCreate(@AuthenticationPrincipal User user,
		@RequestBody ArticleCreateRequestDto request) {
		articleFacadeService.createArticle(user.getUserId(), request);
		return ResponseEntity.status(HttpStatus.CREATED).build();    // 응답 본문 없이 상태 코드만 반환
	}

	/**
	 * 게시글 수정 Api
	 * @param articleId 수정할 게시글 id 요청 데이터
	 * @param request 게시글 수정 요청 데이터
	 */
	@Operation(summary = "게시글 수정", description = "게시글을 수정합니다.")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "게시글 수정 성공"),
		@ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 게시판입니다.")})
	@PutMapping(value = "/{articleId}")
	public ResponseEntity<Void> articleUpdate(@AuthenticationPrincipal User user, @PathVariable int articleId,
		@RequestBody ArticleUpdateRequestDto request) {
		articleFacadeService.updateArticle(user.getUserId(), articleId, request);
		return ResponseEntity.ok().build();
	}

	/**
	 * 게시글 삭제 Api
	 * @param articleId 삭제할 게시글 id 요청 데이터
	 */
	@Operation(summary = "게시글 삭제", description = "게시글을 삭제합니다.")
	@ApiResponses({@ApiResponse(responseCode = "204", description = "게시글 삭제 성공"),
		@ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 게시판입니다.")})
	@DeleteMapping(value = "/{articleId}")
	public ResponseEntity<Void> articleDelete(@AuthenticationPrincipal User user, @PathVariable int articleId) {
		articleFacadeService.deleteArticle(user.getUserId(), articleId);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();    // 응답 본문 없이 상태 코드만 반환-
	}

	/**
	 * 게시글 검색 Api
	 * @param keyword 제목이나 내용에 들어갈 글로 검색
	 */
	@Operation(summary = "게시글 검색", description = "게시글을 검색합니다.")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "게시글 검색 성공"),
		@ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 게시판입니다.")})
	@GetMapping(value = "/search")
	public ResponseEntity<List<ArticleSearchResponseDto>> articleSearch(@RequestParam String keyword) {
		List<ArticleSearchResponseDto> articles = articleFacadeService.searchArticleList(keyword);
		return ResponseEntity.ok().body(articles);
	}
}
