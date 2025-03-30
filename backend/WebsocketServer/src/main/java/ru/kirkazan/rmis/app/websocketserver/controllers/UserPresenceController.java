package ru.kirkazan.rmis.app.websocketserver.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import ru.kirkazan.rmis.app.websocketserver.services.UserPresenceService;
import ru.kirkazan.rmis.app.websocketserver.store.PresenceStatus;
import ru.kirkazan.rmis.app.websocketserver.store.User;

/**
 * @author Nikidzawa
 */
@Controller
public class UserPresenceController {

    @Autowired
    UserPresenceService userPresenceService;

    @MessageMapping("/presence/check")
    @SendToUser("/queue/presence")
    public PresenceStatus checkPresence(@Payload User user) {
        return new PresenceStatus(user.getUserId(), userPresenceService.userIsOnline(Long.valueOf(user.getUserId())));
    }
}
