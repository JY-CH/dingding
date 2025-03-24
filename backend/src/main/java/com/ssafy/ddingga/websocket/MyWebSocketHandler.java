package com.ssafy.ddingga.websocket;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.CloseStatus;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class MyWebSocketHandler implements WebSocketHandler {

	// 전체 클라이언트 세션 (세션 ID -> 세션 객체)
	private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		// 클라이언트와 연결이 성립되었을 때 호출됩니다.
		sessions.put(session.getId(), session);
		System.out.println("WebSocket connection established with session ID: " + session.getId());
	}

	@Override
	public void handleMessage(WebSocketSession session,
		org.springframework.web.socket.WebSocketMessage<?> message) throws Exception {

		try {
			if (message instanceof TextMessage) {
				// 클라이언트가 보낸 메시지를 처리하는 부분
				String payload = ((TextMessage) message).getPayload();
				System.out.println("수신자: " + session + "\nReceived message: " + payload);
				// 클라이언트에게 메시지를 보내는 부분
				session.sendMessage(new TextMessage("Server received: " + payload));

				Map<String, String> data = parseJson(payload);
				String userId = data.get("roomId");
				String event = data.get("event");

				// 이벤트 종류에 따른 처리
				if ("gesture".equals(event)) {

				} else if ("sound".equals(event)) {

				} else if ("leave".equals(event)) {

				}
			}
		} catch (Exception e) {
			System.err.println("WebSocket 메시지 처리 중 오류 발생: " + e.getMessage());
			e.printStackTrace();
			session.close(CloseStatus.SERVER_ERROR);
		}
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

	private void sendMessageSafely(WebSocketSession session, String message) {
		synchronized (session) {
			if (session.isOpen()) {
				try {
					session.sendMessage(new TextMessage(message));
				} catch (IOException e) {
					System.err.println("메시지 전송 오류: " + e.getMessage());
				}
			}
		}
	}

	private Map<String, String> parseJson(String json) {
		Map<String, String> map = new HashMap<>();
		json = json.replaceAll("[{}\"]", "");
		for (String pair : json.split(",")) {
			String[] keyValue = pair.split(":");
			if (keyValue.length == 2) {
				map.put(keyValue[0], keyValue[1]);
			}
		}
		return map;
	}

	private String createJsonMessage(Map<String, Object> messageMap) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			return objectMapper.writeValueAsString(messageMap);
		} catch (IOException e) {
			System.err.println("JSON 변환 오류: " + e.getMessage());
			return null;
		}
	}
}

