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
import ru.nikidzawa.kafka.KafkaLogoutTransferData;
import ru.nikidzawa.websocketserver.services.KafkaProducerService;
import ru.nikidzawa.websocketserver.services.UserPresenceService;
import ru.nikidzawa.websocketserver.store.presence.PresenceStatus;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WebSocketEventListener {

    private static final String presenceDestination = "/personal/presence";

    UserPresenceService userPresenceService;

    SimpMessagingTemplate messagingTemplate;

    KafkaProducerService kafkaProducerService;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        if (event.getUser() != null) {
            Long userId = Long.valueOf(event.getUser().getName());
            if (userPresenceService.userConnected(userId)) {
                messagingTemplate.convertAndSendToUser(
                        event.getUser().getName(),
                        presenceDestination,
                        new PresenceStatus(userId, true, LocalDateTime.now())
                );
            }
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        if (event.getUser() != null) {
            Long userId = Long.valueOf(event.getUser().getName());
            if (userPresenceService.userDisconnected(userId)) {
                LocalDateTime logoutDateTime = LocalDateTime.now();
                messagingTemplate.convertAndSendToUser(
                        event.getUser().getName(),
                        presenceDestination,
                        new PresenceStatus(userId, false, logoutDateTime)
                );

                kafkaProducerService.sendLogoutData(new KafkaLogoutTransferData(userId, logoutDateTime));
            }
        }
    }
}