package com.ssafy.ddingga.domain.weeksong.entity;

import java.time.LocalDateTime;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.ssafy.ddingga.domain.song.entity.Song;

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
public class WeekSong {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer weekId;

	@ManyToOne  // 악보 조회 시 곡 정보도 필요하니 EAGER
	@JoinColumn(name = "song_id", nullable = false)
	private Song song;

	private LocalDateTime startDate;
	private LocalDateTime endDate;
}
