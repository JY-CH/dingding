package com.ssafy.ddingga.domain.user.service;


import com.ssafy.ddingga.domain.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

/**
 * JWT (Json Web Token) 관련 서비스 구현체
 * 토큰 생성, 검증, 파싱의 기능을 제공
 */
@Service
public class JwtServiceImpl implements JwtService {

    /**
     * JWT 토큰 생성에 사용될 비밀 키
     * application.yml에서 설정된 값을 주입받음
     */
    @Value("${jwt.secret}")
    private String secretKey;
    /**
     * JWT 토큰의 유효 기간(밀리초 단위)
     * application.yml에서 설정된 값을 주입 받음
     */
    @Value("${jwt.expiration}")
    private long tokenValidityInMilliseconds;

    /**
     * 사용자 정보를 기반으로 JWT 토큰을 생성
     *
     * @param user 토큰을 생성할 사용자 정보
     * @return 생성된 JWT토큰 문자열
     */
    @Override
    public String createToken(User user) {
        // 토큰 생성 시간
        Date now = new Date();
        // 토큰 만료 시간 (현재시간 + 유효시간)
        Date validity = new Date(now.getTime() + tokenValidityInMilliseconds);

        return Jwts.builder()
                .setSubject(user.getUserId())                  // 토큰의 주체
                .claim("id", user.getId())                  // 사용자 고유 ID
                .claim("username", user.getUsername())      // 사용자 이름
                .setIssuedAt(now)                              // 토큰 발급 시간
                .setExpiration(validity)                       // 토큰 만료 시간
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)    // 서명 알고리즘 및 키
                .compact();                                    // 토큰 생성
    }

    /**
     * 주어진 JWT 토큰의 유효성을 검증
     * @param token 검증할 JWT 토큰 문자열
     * @return 토큰이 유효하면 true, 그렇지 않으면 false
     */
    @Override
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())     // 서명 키 설정
                    .build()
                    .parseClaimsJws(token);     // 토큰 파싱
            return true;    // 파싱 성공 시 유효한 토큰(true)
        } catch (Exception e) {
            return false;   // 파싱 실패 시 유효하지 않은 토큰(false)
        }
    }


    /**
     * JWT 토큰에서 사용자 ID를 추출
     * @param token JWT 토큰 문자열
     * @return  토큰에 포함된 사용자 ID
     */
    @Override
    public String getUserIdFromToken(String token) {
        // 토큰 파싱하여 Claims 객체 얻기
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        // Claims 에서 subject(사용자 ID)추출
        return claims.getSubject();
    }

    /**
     * JWT 토큰 서명에 사용될 키 생성
     *
     * @return 생성된 서명 키
     */
    private Key getSigningKey() {
        // 비밀키를 바이트 배열로 변환
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        // HMAC-SHA 알고리즘을 사용하는 키 생성
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
