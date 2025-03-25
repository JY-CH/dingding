package com.ssafy.ddingga.domain.article.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ssafy.ddingga.domain.article.entity.Article;
import com.ssafy.ddingga.domain.article.repository.ArticleRepository;
import com.ssafy.ddingga.domain.user.entity.User;
import com.ssafy.ddingga.domain.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 게시판 관련 서비스 구현체
 * 게시판 목록 조회, 생성, 수정, 삭제 등의 게시판 관련 비즈니스 로직을 처리
 */
@Slf4j //로그를 위한 어노테이션
@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {

	/**
	 * 게시판 데이터 베이스 접근을 위한 레포지토리
	 * final로 선언되며 생성자 주입으로 초기화됨
	 */
	private final ArticleRepository articleRepository;
	private final UserService userService;

	@Override
	public List<Article> allArticleList() {
		List<Article> articles = articleRepository.findAll();

		return articles;
	}

	@Override
	public void creatArticle(int userId, String title, String content, String category) {
		// userId를 통해 User 엔티티 조회
		User user = userService.getUser(userId);  // userId로 User를 조회

		// User가 존재하지 않는 경우 예외 처리 (null 체크)
		if (user == null) {
			throw new RuntimeException("User not found with id: " + userId);
		} else {
			Article article = Article.builder()
				.user(user)
				.title(title)
				.content(content)
				.category(category)
				.createdAt(LocalDateTime.now())
				.updatedAt(LocalDateTime.now())
				.popularPost(false)
				.recommend(0)
				.build();

			articleRepository.save(article);
		}
	}
}
