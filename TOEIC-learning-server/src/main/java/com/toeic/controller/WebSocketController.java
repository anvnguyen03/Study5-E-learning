package com.toeic.controller;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

	private final SimpMessagingTemplate messagingTemplate;
	
	public void sendNotification(String userId, String message) {
		messagingTemplate.convertAndSendToUser(userId, "/queue/notification", message);
	}
	
}
