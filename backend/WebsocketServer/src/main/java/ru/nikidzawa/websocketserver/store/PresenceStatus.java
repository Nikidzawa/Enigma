package ru.nikidzawa.websocketserver.store;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PresenceStatus {
    String userId;
    Boolean isOnline;
    LocalDateTime lastOnlineDate;

    public PresenceStatus(String userId, Boolean isOnline, LocalDateTime lastOnlineDate) {
        this.userId = userId;
        this.isOnline = isOnline;
        this.lastOnlineDate = lastOnlineDate;
    }
}
