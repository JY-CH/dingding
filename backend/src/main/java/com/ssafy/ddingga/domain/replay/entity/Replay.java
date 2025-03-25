package com.ssafy.ddingga.domain.replay.entity;


import com.ssafy.ddingga.domain.song.entity.Song;
import com.ssafy.ddingga.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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
    @JoinColumn(name = "user_id",nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

    private Integer score;

    private String mode;
    private String videoPath;
    private LocalDateTime practiceDate;
}
