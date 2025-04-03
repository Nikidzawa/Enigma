package ru.nikidzawa.websocketserver.services;

import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserPresenceService {
    private final Set<Long> onlineUsers = ConcurrentHashMap.newKeySet();

    public boolean userConnected(Long userId) {
        return onlineUsers.add(userId);
    }

    public boolean userDisconnected(Long userId) {
        return onlineUsers.remove(userId);
    }

}
