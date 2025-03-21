package com.ssafy.ddingga.domain.user.repository;

import com.ssafy.ddingga.domain.user.entity.AuthProvider;
import com.ssafy.ddingga.domain.user.entity.User;
import com.ssafy.ddingga.domain.user.entity.UserSocial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserSocialRepository extends JpaRepository<UserSocial, Integer> {

    Optional<UserSocial> findByUser(User user);
    Optional<UserSocial> findByProviderAndProviderId(AuthProvider provider, String providerId);
    Optional<UserSocial> findByRefreshToken(String refreshToken);
    void deleteByUser(User user);
}
