package com.ssafy.ddingga.domain.song.entity;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class SheetMusic {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer sheetMusicId;

	@ManyToOne  // 악보 조회 시 곡 정보도 필요하니 EAGER
	@JoinColumn(name = "song_id", nullable = false)
	private Song song;

	// private String sheetImage;
	private Integer sheetOrder;
	private String chord;
	private Integer chordOrder;
	private Float chordTiming;
}
