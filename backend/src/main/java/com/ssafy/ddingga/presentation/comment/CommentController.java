package com.ssafy.ddingga.presentation.comment;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.facade.comment.dto.request.CreateCommentRequestDto;
import com.ssafy.ddingga.facade.comment.dto.request.CreateReplyRequestDto;
import com.ssafy.ddingga.facade.comment.dto.request.UpdateCommentRequestDto;
import com.ssafy.ddingga.facade.comment.dto.response.CreateCommentResponseDto;
import com.ssafy.ddingga.facade.comment.dto.response.CreateReplyResponseDto;
import com.ssafy.ddingga.facade.comment.dto.response.DeleteCommentResponseDto;
import com.ssafy.ddingga.facade.comment.dto.response.GetCommentsResponseDto;
import com.ssafy.ddingga.facade.comment.dto.response.UpdateCommentResponseDto;
import com.ssafy.ddingga.facade.comment.service.CommentFacadeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

/**
 * 댓글 관련 API 엔드포인트를 처리하는 컨트롤러
 */
@Tag(name = "Comment", description = "게시판 댓글 API")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

	private final CommentFacadeService commentFacadeService;

	@Operation(summary = "게시글 댓글 조회", description = "해당 게시글의 댓글을 조회합니다.")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "해당 게시글의 댓글 조회 성공"),
		@ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 댓글입니다.")})
	@GetMapping(value = "/article/{articleId}/comment")
	public ResponseEntity<List<GetCommentsResponseDto>> getComments(@PathVariable int articleId) {
		// 게시글 댓글 조회
		List<GetCommentsResponseDto> response = commentFacadeService.getComments(articleId);
		return ResponseEntity.ok().body(response);
	}

	@Operation(summary = "게시글 댓글 생성", description = "해당 게시글의 댓글을 생성합니다.")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "해당 게시글의 댓글 조회 성공"),
		@ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 게시글입니다.")})
	@PostMapping(value = "/article/{articleId}/comment")
	public ResponseEntity<CreateCommentResponseDto> createComment(@AuthenticationPrincipal User user,
		@PathVariable int articleId, @RequestBody CreateCommentRequestDto requestDto) {
		CreateCommentResponseDto responseDto = new CreateCommentResponseDto();

		responseDto.setSuccess(
			commentFacadeService.createComment(user.getUserId(), articleId, requestDto.getContent()));

		return ResponseEntity.ok().body(responseDto);
	}

	@Operation(summary = "게시글 대댓글 생성", description = "해당 게시글의 대댓글을 생성합니다.")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "해당 게시글의 댓글 생성 성공"),
		@ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 댓글입니다.")})
	@PostMapping(value = "/article/{articleId}/comment/{commentId}")
	public ResponseEntity<CreateReplyResponseDto> createReply(@AuthenticationPrincipal User user,
		@PathVariable int articleId, @PathVariable int commentId, @RequestBody CreateReplyRequestDto requestDto) {
		
		CreateReplyResponseDto responseDto = CreateReplyResponseDto.builder()
			.success(commentFacadeService.createReply(user.getUserId(), articleId, requestDto.getContent(), commentId))
			.build();

		return ResponseEntity.ok().body(responseDto);
	}

	@Operation(summary = "게시글 댓글 수정", description = "해당 게시글의 댓글을 수정합니다.")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "해당 게시글의 댓글 수정 성공"),
		@ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 댓글입니다.")})
	@PutMapping(value = "/comment/{commentId}")
	public ResponseEntity<UpdateCommentResponseDto> updateComment(@AuthenticationPrincipal User user,
		@PathVariable int commentId, @RequestBody UpdateCommentRequestDto requestDto) {

		UpdateCommentResponseDto responseDto = UpdateCommentResponseDto.builder()
			.success(commentFacadeService.updateComment(user.getUserId(), commentId, requestDto.getContent()))
			.build();

		return ResponseEntity.ok().body(responseDto);
	}

	@Operation(summary = "게시글 댓글 삭제", description = "해당 게시글의 댓글을 삭제합니다.")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "해당 게시글의 댓글 삭제 성공"),
		@ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 댓글입니다.")})
	@DeleteMapping(value = "/comment/{commentId}")
	public ResponseEntity<DeleteCommentResponseDto> deleteComment(@AuthenticationPrincipal User user,
		@PathVariable int commentId) {
		DeleteCommentResponseDto responseDto = DeleteCommentResponseDto.builder()
			.success(commentFacadeService.deleteComment(user.getUserId(), commentId))
			.build();

		return ResponseEntity.ok().body(responseDto);
	}

}
