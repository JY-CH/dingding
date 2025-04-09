package com.ssafy.ddingga.domain.rank.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.ddingga.domain.rank.entity.Ranking;
import com.ssafy.ddingga.facade.rank.dto.response.RankingInfo;
import com.ssafy.ddingga.facade.rank.dto.response.TopRankingInfo;

@Repository
public interface RankingRepository extends JpaRepository<Ranking, Integer> {  // Integer로 수정

	@Query(value = "SELECT new com.ssafy.ddingga.facade.rank.dto.response.RankingInfo("
		+ "r.playTime, r.totalTry, r.score, "
		+ "CAST((SELECT COUNT(r2) + 1 FROM Ranking r2 WHERE r2.playTime > r.playTime) AS Integer), "
		+ "CAST((SELECT COUNT(r2) + 1 FROM Ranking r2 WHERE r2.totalTry > r.totalTry) AS Integer), "
		+ "CAST((SELECT COUNT(r2) + 1 FROM Ranking r2 WHERE r2.score > r.score) AS Integer)) "
		+ "FROM Ranking r "
		+ "WHERE r.user.userId = :userId")
	RankingInfo findRankingByUserId(@Param("userId") Integer userId);

	@Query(value = "SELECT new com.ssafy.ddingga.facade.rank.dto.response.TopRankingInfo("
		+ "CAST((SELECT COUNT(r2) + 1 FROM Ranking r2 WHERE r2.playTime > r.playTime) AS Integer), "
		+ "r.user.username, "
		+ "r.user.profileImage, "
		+ "r.playTime, "
		+ "r.totalTry, "
		+ "r.score) "
		+ "FROM Ranking r "
		+ "ORDER BY r.playTime DESC")
	List<TopRankingInfo> findTop10ByPlayTime(Pageable pageable);

	@Query(value = "SELECT new com.ssafy.ddingga.facade.rank.dto.response.TopRankingInfo("
		+ "CAST((SELECT COUNT(r2) + 1 FROM Ranking r2 WHERE r2.totalTry > r.totalTry) AS Integer), "
		+ "r.user.username, "
		+ "r.user.profileImage, "
		+ "r.playTime, "
		+ "r.totalTry, "
		+ "r.score) "
		+ "FROM Ranking r "
		+ "ORDER BY r.totalTry DESC")
	List<TopRankingInfo> findTop10ByTotalTry(Pageable pageable);

	@Query(value = "SELECT new com.ssafy.ddingga.facade.rank.dto.response.TopRankingInfo("
		+ "CAST((SELECT COUNT(r2) + 1 FROM Ranking r2 WHERE r2.score > r.score) AS Integer), "
		+ "r.user.username, "
		+ "r.user.profileImage, "
		+ "r.playTime, "
		+ "r.totalTry, "
		+ "r.score) "
		+ "FROM Ranking r "
		+ "ORDER BY r.score DESC")
	List<TopRankingInfo> findTop10ByScore(Pageable pageable);

	Optional<Ranking> findByUser_UserId(Integer userId);
}
