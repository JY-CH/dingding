package com.ssafy.ddingga.global.config;

import java.time.Duration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.http.urlconnection.UrlConnectionHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
@Slf4j
public class S3Config {
	private static final Logger logger = LoggerFactory.getLogger(S3Config.class);

	@Value("${spring.cloud.aws.credentials.access-key}")
	private String accessKey;

	@Value("${spring.cloud.aws.credentials.secret-key}")
	private String secretKey;

	@Value("${spring.cloud.aws.region.static}")
	private String region;

	@Bean
	public S3Client s3Client() {
		AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);
		return S3Client.builder()
			.region(Region.of(region))
			.credentialsProvider(StaticCredentialsProvider.create(credentials))
			.httpClientBuilder(UrlConnectionHttpClient.builder()
				.socketTimeout(Duration.ofMinutes(5))  // 소켓 타임아웃 5분
				.connectionTimeout(Duration.ofMinutes(1)))  // 연결 타임아웃 1분
			.build();
	}
}