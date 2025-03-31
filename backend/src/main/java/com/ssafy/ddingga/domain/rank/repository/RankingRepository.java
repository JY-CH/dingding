package com.ssafy.ddingga.domain.rank.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.domain.rank.entity.Ranking;
import com.ssafy.ddingga.facade.rank.dto.response.RankingInfo;
import com.ssafy.ddingga.facade.rank.dto.response.TopRankingResponse;

@Repository
public interface RankingRepository extends JpaRepository<Ranking, User> {

	@Query(value = "SELECT new com.ssafy.ddingga.facade.rank.dto.response.RankingInfo("
		+ "r.playTime, r.totalTry, r.score, "
		+ "CAST((SELECT COUNT(r2) + 1 FROM Ranking r2 WHERE r2.playTime > r.playTime) AS Integer), "
		+ "CAST((SELECT COUNT(r2) + 1 FROM Ranking r2 WHERE r2.totalTry > r.totalTry) AS Integer), "
		+ "CAST((SELECT COUNT(r2) + 1 FROM Ranking r2 WHERE r2.score > r.score) AS Integer)) "
		+ "FROM Ranking r "
		+ "WHERE r.user.userId = :userId")
	RankingInfo findRankingByUserId(@Param("userId") Integer userId);

	@Query(value = "SELECT new com.ssafy.ddingga.facade.rank.dto.response.TopRankingResponse("
		+ "CAST((SELECT COUNT(r2) + 1 FROM Ranking r2 WHERE r2.playTime > r.playTime) AS Integer), "
		+ "r.user.username, "
		+ "r.playTime, "
		+ "r.totalTry, "
		+ "r.score) "
		+ "FROM Ranking r "
		+ "ORDER BY r.playTime DESC "
		+ "LIMIT 5")
	List<TopRankingResponse> findTop5ByPlayTime();

	@Query(value = "SELECT new com.ssafy.ddingga.facade.rank.dto.response.TopRankingResponse("
		+ "CAST((SELECT COUNT(r2) + 1 FROM Ranking r2 WHERE r2.totalTry > r.totalTry) AS Integer), "
		+ "r.user.username, "
		+ "r.playTime, "
		+ "r.totalTry, "
		+ "r.score) "
		+ "FROM Ranking r "
		+ "ORDER BY r.totalTry DESC "
		+ "LIMIT 5")
	List<TopRankingResponse> findTop5ByTotalTry();

	@Query(value = "SELECT new com.ssafy.ddingga.facade.rank.dto.response.TopRankingResponse("
		+ "CAST((SELECT COUNT(r2) + 1 FROM Ranking r2 WHERE r2.score > r.score) AS Integer), "
		+ "r.user.username, "
		+ "r.playTime, "
		+ "r.totalTry, "
		+ "r.score) "
		+ "FROM Ranking r "
		+ "ORDER BY r.score DESC "
		+ "LIMIT 5")
	List<TopRankingResponse> findTop5ByScore();
}
