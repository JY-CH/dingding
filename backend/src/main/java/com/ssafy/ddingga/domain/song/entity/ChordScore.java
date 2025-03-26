package com.ssafy.ddingga.domain.song.entity;

import com.ssafy.ddingga.domain.auth.entity.User;

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
public class ChordScore {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer chordId;

	@ManyToOne(fetch = FetchType.LAZY) //조회시 userId 외에는 필요없어서 fetch = FetchType.LAZY
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@ManyToOne // songId를 통해 songTitle이 필요하므로 기본형인 EAGER
	@JoinColumn(name = "song_id", nullable = false)
	private Song song;

	private Integer score;
	private Integer count;

}
