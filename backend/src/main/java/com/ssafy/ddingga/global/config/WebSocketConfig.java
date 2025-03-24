package com.ssafy.ddingga.global.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;  // 추가
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

import com.ssafy.ddingga.websocket.MyWebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

	private final MyWebSocketHandler myWebSocketHandler;

	// 의존성 주입을 통해 핸들러를 주입
	public WebSocketConfig(MyWebSocketHandler myWebSocketHandler) {
		this.myWebSocketHandler = myWebSocketHandler;
	}

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		// 웹소켓 핸들러와 URL 경로를 매핑
		registry.addHandler(myWebSocketHandler, "/ws")
			.addInterceptors(new HttpSessionHandshakeInterceptor()) // 핸드셰이크 인터셉터 (선택 사항)
			.setAllowedOrigins("*"); // CORS 설정 (필요시)
	}
}
