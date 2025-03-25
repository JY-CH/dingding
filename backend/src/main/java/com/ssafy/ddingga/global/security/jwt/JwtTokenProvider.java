package com.ssafy.ddingga.global.security.jwt;

import com.ssafy.ddingga.domain.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtProperties jwtProperties;

    private final Key getSigningKey() {
        byte[] keyBytes = jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * AcessToken 설정
     * @param user 토큰을 생성할 생성자 정보
     * @return 생성된 JWT AccessToken
     */
    public String createAccessToken(User user) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + jwtProperties.getAccessTokenExpiration()*1000);

        return Jwts.builder()
                .setSubject(user.getLoginId())
                .claim("loginId", user.getLoginId())
                .claim("username", user.getUsername())
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Refresh Token 생성
     * @param user 토큰을 생성할 생성자 정보
     * @return 생성된 JWT Refresh Token
     */
    public String createRefreshToken(User user) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + jwtProperties.getRefreshTokenExpiration());

        return Jwts.builder()
                .setSubject(user.getLoginId())
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * JWT 토큰에서 사용자 ID 추출
     * @param token JWT 토큰
     * @return 사용자 ID
     */
    public String getLoginId(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * JKT 토큰의 유효성 검증
     * @param token 검증할 JWT 토큰
     * @return 토큰 유효성 여부
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}