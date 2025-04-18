package ru.nikidzawa.websocketserver.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import ru.nikidzawa.websocketserver.services.UserPresenceService;
import ru.nikidzawa.websocketserver.store.*;

/**
 * @author Nikidzawa
 */
@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChatController {

    SimpMessagingTemplate messagingTemplate;

    UserPresenceService userPresenceService;

    private static final String sendMessageDestination = "/queue/messages";
    private static final String typingDestination = "/queue/typing";
    private static final String readMessageDestination = "/queue/read";
    private static final String changedProfileDestination = "/profile/changed";
    private static final String presenceDestination = "/personal/presence";

    @MessageMapping("/message/send")
    public void processMessage(@Payload ChatMessage chatMessage) {
        messagingTemplate.convertAndSendToUser(chatMessage.getReceiverId(),sendMessageDestination, chatMessage);
        messagingTemplate.convertAndSendToUser(chatMessage.getSenderId(), typingDestination, new Typing(chatMessage.getSenderId(), false));
    }

    @MessageMapping("/chat/typing")
    public void isTyping(@Payload Typing typing) {
        messagingTemplate.convertAndSendToUser(typing.getUserId(), typingDestination, typing);
    }

    @MessageMapping("/message/read")
    public void readMessage(@Payload MessageRead messageRead) {
        messagingTemplate.convertAndSendToUser(messageRead.getUserId(), readMessageDestination, messageRead);
    }

    @MessageMapping("/profile/changed")
    public void processMessage(@Payload User user) {
        messagingTemplate.convertAndSendToUser(user.getUserId(), changedProfileDestination, user);
    }

    @MessageMapping("/presence/check")
    public void checkPresence(@Payload PresenceCheck presenceCheck) {
        messagingTemplate.convertAndSendToUser(
                presenceCheck.getUserTargetId().toString(),
                presenceDestination,
                new PresenceStatus(
                        presenceCheck.getUserTargetId(),
                        userPresenceService.userIsOnline(presenceCheck.getUserTargetId()),
                        null
                )
        );
    }
}
