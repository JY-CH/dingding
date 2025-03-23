package com.ssafy.ddingga.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

//Redis와 연동할 때 사용
@Configuration  // 이 클래스가 Spring의 설정 클래스를 나타내는 것임을 알리는 애너테이션
public class RedisConfig {

	@Bean  // Spring이 이 메서드를 호출하여 Bean을 등록할 수 있도록 하는 애너테이션
	public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
		// RedisTemplate은 Redis에 대한 작업을 수행할 때 사용하는 기본 클래스입니다.
		RedisTemplate<String, Object> template = new RedisTemplate<>();

		// RedisConnectionFactory는 Redis에 연결을 설정하는 데 사용되는 객체입니다.
		// RedisTemplate에 연결 팩토리를 설정합니다.
		template.setConnectionFactory(connectionFactory);

		// Redis의 키(Key)에 대한 직렬화 방식을 설정
		// StringRedisSerializer는 문자열을 직렬화하는 데 사용됩니다.
		template.setKeySerializer(new StringRedisSerializer());

		// Redis의 해시(Hash)에서 키(Key)에 대한 직렬화 방식을 설정
		template.setHashKeySerializer(new StringRedisSerializer());

		// Redis의 값(Value)에 대한 직렬화 방식을 설정
		// Jackson2JsonRedisSerializer는 값을 JSON 형식으로 직렬화하고 역직렬화하는 데 사용됩니다.
		template.setValueSerializer(new Jackson2JsonRedisSerializer<>(Object.class));

		// Redis의 해시(Hash)에서 값(Value)에 대한 직렬화 방식을 설정
		template.setHashValueSerializer(new Jackson2JsonRedisSerializer<>(Object.class));

		// 설정된 RedisTemplate 객체를 반환
		return template;
	}
}