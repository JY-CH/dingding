package com.ssafy.ddingga.global.security.jwt;


import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;


/**
 * JWT 관련 설정값을 관리하는 클래스
 * application.yml 에서 'jwt' prefix로 시작하는 설정값들을 자동으로 바인딩
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    /**
     * JWT 토큰 생성 및 검증에 사용되는 비밀 키
     * application.yml에서 설정
     * 실제 운영 환경에서는 환경변수로 관리
     */
    private String secret;
    private Long accessTokenExpiration;    // Access Token의 유효 기간 (밀리초 단위)
    private Long refreshTokenExpiration;    // Refresh Token의 유효 기간 (밀리초 단위)
    /**
     * JWT 토큰의 접두사
     * 예 : "Bearer "
     * Authorization 헤더에서 토큰을 식별하는데 사용
     */
    private String tokenPrefix;
    /**
     * HTTP 요청 헤더에서 JWT 토큰을 전달하는 헤더 이름
     * 예 : "Authorization"
     * 클라이언트가 토큰을 전달할 때 사용하는 헤더
     */
    private String headerPrefix;
}
