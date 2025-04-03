package com.ssafy.ddingga.common.converter;

import java.time.Duration;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)  // autoApply = true로 설정하면 모든 Duration 필드에 자동으로 적용됨
public class DurationConverter implements AttributeConverter<Duration, Long> {

	@Override
	public Long convertToDatabaseColumn(Duration attribute) {
		return attribute != null ? attribute.getSeconds() : null;  // Duration을 초 단위로 변환
	}

	@Override
	public Duration convertToEntityAttribute(Long dbData) {
		return dbData != null ? Duration.ofSeconds(dbData) : null;  // DB에서 읽은 값을 Duration으로 변환
	}
}
