package com.ssafy.ddingga.domain.song.entity;

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
	private String singer;

	// 노래의 재생 시간을 "HH:MM:SS" 형식으로 저장
	private String songDuration;  // 예: "00:03:30" (3분 30초)
}
