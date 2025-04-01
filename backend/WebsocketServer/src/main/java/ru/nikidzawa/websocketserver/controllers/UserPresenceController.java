package ru.nikidzawa.websocketserver.controllers;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import ru.nikidzawa.websocketserver.services.UserPresenceService;
import ru.nikidzawa.websocketserver.store.PresenceStatus;
import ru.nikidzawa.websocketserver.store.User;

/**
 * @author Nikidzawa
 */
@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserPresenceController {

    UserPresenceService userPresenceService;

    @MessageMapping("/presence/check")
    @SendToUser("/queue/presence")
    public PresenceStatus checkPresence(@Payload User user) {
        return new PresenceStatus(user.getUserId(), userPresenceService.userIsOnline(Long.valueOf(user.getUserId())));
    }
}
