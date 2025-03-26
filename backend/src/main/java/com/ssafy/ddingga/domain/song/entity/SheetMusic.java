package com.ssafy.ddingga.domain.song.entity;


import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class SheetMusic {

    @Id
    @ManyToOne  // 악보 조회 시 곡 정보도 필요하니 EAGER
    private Song song;

    private String sheetImage;
    private Integer sheetOrder;

}
