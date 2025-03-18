package com.ssafy.ddingga.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Date;

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
    private String userId;  // user의 id
    private String password; // user 비밀번호
    private String username;    // user 닉네임(이름)
    private LocalDateTime createAt; // 가입일자
    private Date updateAt;  // 수정일자
    private String profileImage;    // 프로필이미지
    private Boolean isDeleted;  // 회원탈퇴여부

}
