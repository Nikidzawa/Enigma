package ru.nikidzawa.websocketserver.store;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PresenceStatus {
    String userId;
    Boolean isOnline;

    public PresenceStatus(String userId, Boolean isOnline) {
        this.userId = userId;
        this.isOnline = isOnline;
    }
}
