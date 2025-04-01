package ru.nikidzawa.websocketserver.listener;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import ru.nikidzawa.websocketserver.services.KafkaProducerService;
import ru.nikidzawa.websocketserver.services.UserPresenceService;
import ru.nikidzawa.websocketserver.store.PresenceStatus;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WebSocketEventListener {

    UserPresenceService userPresenceService;

    SimpMessagingTemplate messagingTemplate;

    KafkaProducerService kafkaProducerService;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        if (event.getUser() != null && userPresenceService.userConnected(Long.valueOf(event.getUser().getName()))) {
            log.atInfo().log("User connected: {}", event.getUser().getName());
            messagingTemplate.convertAndSendToUser(event.getUser().getName(), "/personal/presence", new PresenceStatus(event.getUser().getName(), true));
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        if (event.getUser() != null && userPresenceService.userDisconnected(Long.valueOf(event.getUser().getName()))) {
            log.atInfo().log("User disconnected: {}", event.getUser().getName());
            messagingTemplate.convertAndSendToUser(event.getUser().getName(), "/personal/presence", new PresenceStatus(event.getUser().getName(), false));
            kafkaProducerService.sendLogoutData(event.getUser().getName());
        }
    }
}