package com.ssafy.ddingga.global.service;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

@Service
@RequiredArgsConstructor
public class S3Service {
	private final S3Client s3Client;

	@Value("${spring.cloud.aws.s3.bucket}")
	private String bucket;

	@Value("${spring.cloud.aws.region.static}")
	private String region;

	public String getBucket() {
		return bucket;
	}

	// 파일 업로드 (자동 디렉토리 구분) -> 파일만 받음
	public String uploadFile(MultipartFile file) throws IOException {
		String contentType = file.getContentType();
		String dirName = getDirectoryByContentType(contentType);
		return uploadFile(file, dirName); // 두 번째 uploadFile 호출
	}

	//파일 업로드 (지정된 디렉토리) - 파일과 디렉토리 이름을 받음
	public String uploadFile(MultipartFile file, String dirName) throws IOException {
		String fileName = createFileName(file.getOriginalFilename());
		String fileKey = dirName + "/" + fileName;

		// 업로드 로직
		PutObjectRequest putObjectRequest = PutObjectRequest.builder()
			.bucket(bucket)
			.key(fileKey)
			.contentType(file.getContentType())
			.build();

		s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
		return fileKey;
	}

	// 파일 삭제
	public void deleteFile(String fileKey) {
		DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
			.bucket(bucket)
			.key(fileKey)
			.build();

		s3Client.deleteObject(deleteObjectRequest);
	}

	// GetObject를 위한 Presigned URL 생성
	public String generateGetPresignedUrl(String fileKey) {
		S3Presigner presigner = S3Presigner.builder()
			.region(s3Client.serviceClientConfiguration().region())
			.build();

		GetObjectRequest getObjectRequest = GetObjectRequest.builder()
			.bucket(bucket)
			.key(fileKey)
			.build();

		GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
			.signatureDuration(Duration.ofHours(1))
			.getObjectRequest(getObjectRequest)
			.build();

		String presignedUrl = presigner.presignGetObject(presignRequest).url().toString();
		presigner.close();

		return presignedUrl;
	}

	// PutObject를 위한 Presigned URL 생성
	public String generatePutPresignedUrl(String fileKey, String contentType) {
		S3Presigner presigner = S3Presigner.builder()
			.region(s3Client.serviceClientConfiguration().region())
			.build();

		PutObjectRequest putObjectRequest = PutObjectRequest.builder()
			.bucket(bucket)
			.key(fileKey)
			.contentType(contentType)
			.build();

		PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
			.signatureDuration(Duration.ofHours(1))
			.putObjectRequest(putObjectRequest)
			.build();

		String presignedUrl = presigner.presignPutObject(presignRequest).url().toString();
		presigner.close();

		return presignedUrl;
	}

	// 파일 URL 생성
	public String getFileUrl(String fileKey) {
		return String.format("https://%s.s3.%s.amazonaws.com/%s", bucket, region, fileKey);
	}

	private String createFileName(String originalFileName) {
		return UUID.randomUUID().toString() + "_" + originalFileName;
	}

	// ContentType에 따른 디렉토리 구분
	private String getDirectoryByContentType(String contentType) {
		if (contentType == null) {
			return "others";
		}

		if (contentType.startsWith("profile/")) {
			return "profileImages";
		} else if (contentType.startsWith("replay/")) {
			return "replays";
		} else {
			return "others";
		}
	}
}