package com.ssafy.ddingga.websocket;

import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.CloseStatus;
import org.springframework.stereotype.Component;


@Component
public class MyWebSocketHandler implements WebSocketHandler {

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		// 클라이언트와 연결이 성립되었을 때 호출됩니다.
		System.out.println("WebSocket connection established with session ID: " + session.getId());
	}

	@Override
	public void handleMessage(WebSocketSession session,
		org.springframework.web.socket.WebSocketMessage<?> message) throws Exception {
		// 클라이언트가 보낸 메시지를 처리하는 부분
		String payload = (String)message.getPayload();
		System.out.println("Received message: " + payload);

		// 클라이언트에게 메시지를 보내는 부분
		session.sendMessage(new TextMessage("Server received: " + payload));
	}

	@Override
	public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
		// 오류가 발생했을 때 호출됩니다.
		System.err.println("Error occurred with session ID: " + session.getId());
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
		// 연결이 종료되었을 때 호출됩니다.
		System.out.println("WebSocket connection closed with session ID: " + session.getId());
	}

	@Override
	public boolean supportsPartialMessages() {
		return false; // 부분 메시지 처리 여부 설정
	}
}

