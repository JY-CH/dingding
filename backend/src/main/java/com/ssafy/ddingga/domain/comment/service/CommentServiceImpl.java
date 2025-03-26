package com.ssafy.ddingga.domain.comment.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.comment.entity.Comment;
import com.ssafy.ddingga.domain.comment.repository.CommentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j //로그를 위한 어노테이션
@Service
@RequiredArgsConstructor // final 필드나 @NonNull이 붙은 필드를 매개변수로 받는 생성자를 자동으로 생성해주는 어노테이션
public class CommentServiceImpl implements CommentService {

	private final CommentRepository commentRepository;

	@Override
	public List<Comment> getComments() {
		return List.of();
	}

	@Override
	public boolean createComment() {
		return false;
	}

	@Override
	public boolean updateComment() {
		return false;
	}

	@Override
	public boolean deleteComment() {
		return false;
	}
}
