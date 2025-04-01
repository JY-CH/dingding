package com.ssafy.ddingga.presentation.song;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ddingga.facade.song.dto.request.SearchSongRequestDto;
import com.ssafy.ddingga.facade.song.dto.response.GetSongResponseDto;
import com.ssafy.ddingga.facade.song.dto.response.SearchSongResponseDto;
import com.ssafy.ddingga.facade.song.dto.response.SelectSongResponseDto;
import com.ssafy.ddingga.facade.song.service.SongFacadeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/song")
@RequiredArgsConstructor
public class SongController {

	private final SongFacadeService songFacadeService;

	@Operation(summary = "노래 조회", description = "노래들을 조회합니다.")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "해당 게시글의 댓글 조회 성공"),
		@ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 댓글입니다.")})
	@GetMapping(value = "")
	public ResponseEntity<List<GetSongResponseDto>> getSong() {
		// 노래 전체 조회
		List<GetSongResponseDto> responseDto = songFacadeService.getSong();
		return ResponseEntity.ok().body(responseDto);
	}

	@Operation(summary = "노래 선택", description = "선택한 노래의 정보를 가져옵니다.")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "해당 게시글의 댓글 조회 성공"),
		@ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 노래입니다.")})
	@GetMapping(value = "/{songId}")
	public ResponseEntity<SelectSongResponseDto> selectSong(@PathVariable int songId) {
		SelectSongResponseDto responseDto = songFacadeService.selectSong(songId);

		return ResponseEntity.ok().body(responseDto);
	}

	@Operation(summary = "노래 검색", description = "노래를 검색합니다.")
	@ApiResponses({@ApiResponse(responseCode = "200", description = "해당 게시글의 댓글 생성 성공"),
		@ApiResponse(responseCode = "400", description = "잘못된 요청"),
		@ApiResponse(responseCode = "404", description = "존재하지 않는 댓글입니다.")})
	@GetMapping(value = "/search")
	public ResponseEntity<List<SearchSongResponseDto>> searchSong(@RequestBody SearchSongRequestDto requestDto) {

		List<SearchSongResponseDto> responseDto = songFacadeService.searchSong(requestDto.getKeyword());

		return ResponseEntity.ok().body(responseDto);
	}
}
