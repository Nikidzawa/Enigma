package ru.kirkazan.rmis.app.websocketserver.config;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import ru.kirkazan.rmis.app.websocketserver.store.StompPrincipal;

public class AuthChannelInterceptor implements ChannelInterceptor {


    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String id = accessor.getFirstNativeHeader("id");
            accessor.setUser(new StompPrincipal(id));
        }

        return message;
    }
}
