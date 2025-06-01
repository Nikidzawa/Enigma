package ru.nikidzawa.websocketserver.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import ru.nikidzawa.websocketserver.services.UserPresenceService;
import ru.nikidzawa.websocketserver.store.presence.PresenceCheck;
import ru.nikidzawa.websocketserver.store.presence.PresenceStatus;

/**
 * @author Nikidzawa
 */
@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PresenceController {

    SimpMessagingTemplate messagingTemplate;

    UserPresenceService userPresenceService;

    private static final String presenceDestination = "/personal/presence";

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
