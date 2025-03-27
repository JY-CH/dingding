package com.ssafy.ddingga.domain.replay.entity;

import java.time.LocalDateTime;

import com.ssafy.ddingga.domain.auth.entity.User;
import com.ssafy.ddingga.domain.song.entity.Song;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class Replay {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer replayId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne
	@JoinColumn(name = "song_id", nullable = false)
	private Song song;

	private Integer score;

	private String mode;
	private String videoPath;
	private LocalDateTime practiceDate;
}
