package com.ssafy.ddingga;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // 주간 노래 선정을 위한 스케쥴러 어노테이션
public class DdinggaApplication {

	public static void main(String[] args) {
		SpringApplication.run(DdinggaApplication.class, args);
	}

}
