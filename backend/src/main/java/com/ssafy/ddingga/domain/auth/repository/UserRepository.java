package com.ssafy.ddingga.domain.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.ddingga.domain.auth.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
	Optional<User> findByLoginId(String loginId);

	boolean existsByLoginId(String loginId);

	Optional<User> findByUserId(Integer userId);

}
