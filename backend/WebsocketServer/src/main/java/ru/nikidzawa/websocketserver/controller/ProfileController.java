package ru.nikidzawa.websocketserver.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import ru.nikidzawa.websocketserver.store.User;

/**
 * @author Nikidzawa
 */
@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileController {

    SimpMessagingTemplate messagingTemplate;

    private static final String changedProfileDestination = "/profile/changed";

    @MessageMapping("/profile/changed")
    public void processMessage(@Payload User user) {
        messagingTemplate.convertAndSendToUser(user.getUserId(), changedProfileDestination, user);
    }
}
