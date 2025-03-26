package com.ssafy.ddingga.domain.rank.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.domain.rank.entity.Ranking;
import com.ssafy.ddingga.facade.rank.dto.RankingInfo;

@Repository
public interface RankingRepository extends JpaRepository<Ranking, User> {

	@Query(value = "SELECT r.playTime as playTime, "
		+ "r.totalTry as totalTry, "
		+ "(SELECT COUNT(r2) + 1 FROM Ranking r2 WHERE r2.playTime > r.playTime) as playtimeRank, "
		+ "(SELECT COUNT(r2) + 1 FROM Ranking r2 WHERE r2.totalTry > r.totalTry) as totalTryRank "
		+ "FROM Ranking r "
		+ "WHERE r.user.userId = :userId")
	RankingInfo findRankingByUserId(@Param("userId") Integer userId);

}
