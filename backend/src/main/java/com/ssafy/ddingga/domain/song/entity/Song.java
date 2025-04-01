package com.ssafy.ddingga.domain.song.entity;

import java.time.LocalTime;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class Song {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer songId;

	@Column(name = "song_title")
	private String songTitle;
	private String songImage;

	@Column(name = "song_writer")
	private String songWriter;

	// 추가된 시간 정보 컬럼
	private LocalTime songDuration;  // 노래 시간 (분:초) 형태로 저장
}
