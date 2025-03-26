package com.ssafy.ddingga.presentation.example.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssafy.ddingga.facade.example.dto.ExamplePostRequestDto;
import com.ssafy.ddingga.facade.example.service.ExampleFacadeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/example")
public class ExampleController {
	private final ExampleFacadeService exampleFacadeService;

	@Operation(summary = "예제 등록", description = "예제를 등록합니다.")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "201", description = "정상 등록되었습니다!")
	})
	@PostMapping("")
	public ResponseEntity<Void> createExample(
		@RequestBody ExamplePostRequestDto examplePostRequestDto) {
		exampleFacadeService.createExample(examplePostRequestDto);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}
}
