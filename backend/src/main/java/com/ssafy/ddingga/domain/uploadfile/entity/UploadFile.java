package com.ssafy.ddingga.domain.uploadfile.entity;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.ssafy.ddingga.domain.auth.entity.User;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class UploadFile {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer uploadFileId;

	@ManyToOne // 여러 개의 댓글이 하나의 사용자(User)에 의해 작성된다는 다대일 관계
	@JoinColumn(name = "user_id", nullable = false) // 외래 키로 User 엔티티의 "user_id"를 사용
	private User user;

	private String title;
	private String fileUrl;
}
