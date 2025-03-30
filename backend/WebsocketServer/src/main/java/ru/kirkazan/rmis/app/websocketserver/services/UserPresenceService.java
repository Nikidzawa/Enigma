package ru.kirkazan.rmis.app.websocketserver.services;

import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserPresenceService {
    private final Set<Long> onlineUsers = ConcurrentHashMap.newKeySet();

    public void userConnected(Long userId) {
        onlineUsers.add(userId);
    }

    public void userDisconnected(Long userId) {
        onlineUsers.remove(userId);
    }

    public boolean userIsOnline(Long userId) {
        return onlineUsers.contains(userId);
    }
}
