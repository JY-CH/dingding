package com.ssafy.ddingga.domain.user.repository;

import com.ssafy.ddingga.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByLoginId(String loginId);
    boolean existsByLoginId(String loginId);
    Optional<User> findByUserId(int userId);

}
