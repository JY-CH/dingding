package com.ssafy.ddingga.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Setter
@Getter
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // userPk

    @Column(unique = true)
    private String userId;  // user의 id
    private String password; // user 비밀번호
    private String username;    // user 닉네임(이름)
    private LocalDateTime createAt; // 가입일자
    private String profileImage;    // 프로필이미지
    private Boolean isDeleted;  // 회원탈퇴여부

    /** 사용자가 어떤 권한을 가지고 있는지 정의,
     * JWT 토큰에 이 권한정보가 포함, API 요청 시 권한검사에 사용
     */
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 모든 사용자는 기본적으로 USER 권한을 가짐 나중에 관리자 추가하게 되면
        // ROLE enum을 통해 권한 부여
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

}
