package ru.kirkazan.rmis.app.websocketserver.listener;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import ru.kirkazan.rmis.app.websocketserver.services.UserPresenceService;
import ru.kirkazan.rmis.app.websocketserver.store.PresenceStatus;

@Component
public class WebSocketEventListener {

    @Autowired
    UserPresenceService userPresenceService;

    @Autowired
    SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        if (userPresenceService.userConnected(Long.valueOf(event.getUser().getName()))) {
            System.out.println("User connected: " + event.getUser().getName());
            messagingTemplate.convertAndSendToUser(event.getUser().getName(), "/personal/presence", new PresenceStatus(event.getUser().getName(), true));
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        if (userPresenceService.userDisconnected(Long.valueOf(event.getUser().getName()))) {
            System.out.println("User disconnected: " + event.getUser().getName());
            messagingTemplate.convertAndSendToUser(event.getUser().getName(), "/personal/presence", new PresenceStatus(event.getUser().getName(), false));
            userPresenceService.userDisconnected(Long.valueOf(event.getUser().getName()));
        }
    }
}