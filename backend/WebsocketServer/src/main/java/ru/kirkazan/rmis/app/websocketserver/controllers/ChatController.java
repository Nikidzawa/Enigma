package ru.kirkazan.rmis.app.websocketserver.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import ru.kirkazan.rmis.app.websocketserver.store.ChatMessage;

/**
 * @author Nikidzawa
 */
@Controller
public class ChatController {

    @Autowired
    SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/message/send")
    public void processMessage(@Payload ChatMessage chatMessage) {
        messagingTemplate.convertAndSendToUser(chatMessage.getReceiverId(),"/queue/messages", chatMessage);
    }
}
