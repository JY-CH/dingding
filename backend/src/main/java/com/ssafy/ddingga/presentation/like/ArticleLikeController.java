package com.ssafy.ddingga.presentation.like;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.facade.like.dto.response.LikeArticleResponseDto;
import com.ssafy.ddingga.facade.like.dto.response.UnLikeArticleResponseDto;
import com.ssafy.ddingga.facade.like.service.ArticleLikeFacadeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Like", description = "게시판 좋아요 API")
@RestController
@RequestMapping("/api/{articleId}/like")
@RequiredArgsConstructor
public class ArticleLikeController {

	private final ArticleLikeFacadeService articleLikeFacadeService;

	@Operation(summary = "게시글 좋아요", description = "해당 게시글에 좋아요")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "게시글 좋아요 성공"),
		@ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 게시판입니다.")})
	@PostMapping(value = "")
	public ResponseEntity<LikeArticleResponseDto> likeArticle(@AuthenticationPrincipal User user,
		@PathVariable int articleId) {
		LikeArticleResponseDto response = articleLikeFacadeService.likeArticle(user.getUserId(), articleId);
		return ResponseEntity.ok().body(response);
	}

	@Operation(summary = "게시글 좋아요 취소", description = "해당 게시글에 좋아요 취소")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "게시글 좋아요 취소 성공"),
		@ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 게시판입니다.")})
	@DeleteMapping(value = "")
	public ResponseEntity<UnLikeArticleResponseDto> unLikeArticle(@AuthenticationPrincipal User user,
		@PathVariable int articleId) {
		UnLikeArticleResponseDto response = articleLikeFacadeService.unLikeArticle(user.getUserId(), articleId);
		return ResponseEntity.ok().body(response);
	}
}
