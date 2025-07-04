package com.ssafy.ddingga.facade.comment.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetCommentsResponseDto {
	Integer commentId;
	Integer userId;
	String username;
	String userProfile;
	String content;
	LocalDateTime createdAt;
	LocalDateTime updateAt;
	Boolean isDeleted;
	List<GetCommentsResponseDto> comments;
}