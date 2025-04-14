package com.ssafy.ddingga.domain.uploadfile.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssafy.ddingga.domain.uploadfile.entity.UploadFile;

public interface UploadFileRepository extends JpaRepository<UploadFile, Integer> {
}
