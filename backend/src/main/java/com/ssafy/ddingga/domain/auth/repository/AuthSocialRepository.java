package com.ssafy.ddingga.domain.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.ddingga.domain.auth.entity.AuthProvider;
import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.domain.auth.entity.UserSocial;

public interface AuthSocialRepository extends JpaRepository<UserSocial, Integer> {

	Optional<UserSocial> findByUser(User user);

	Optional<UserSocial> findByProviderAndProviderId(AuthProvider provider, String providerId);

	Optional<UserSocial> findByRefreshToken(String refreshToken);

	void deleteByUser(User user);
}
