package ru.nikidzawa.websocketserver.controllers;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import ru.nikidzawa.websocketserver.store.ChatMessage;
import ru.nikidzawa.websocketserver.store.MessageRead;
import ru.nikidzawa.websocketserver.store.Typing;

/**
 * @author Nikidzawa
 */
@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatController {

    SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/message/send")
    public void processMessage(@Payload ChatMessage chatMessage) {
        messagingTemplate.convertAndSendToUser(chatMessage.getReceiverId(),"/queue/messages", chatMessage);
        messagingTemplate.convertAndSendToUser(chatMessage.getSenderId(), "/queue/typing", new Typing(chatMessage.getSenderId(), false));
    }

    @MessageMapping("/chat/typing")
    public void isTyping(@Payload Typing typing) {
        messagingTemplate.convertAndSendToUser(typing.getUserId(), "/queue/typing", typing);
    }

    @MessageMapping("/message/read")
    public void readMessage(@Payload MessageRead messageRead) {
        messagingTemplate.convertAndSendToUser(messageRead.getUserId(), "/queue/read", messageRead);
    }
}
