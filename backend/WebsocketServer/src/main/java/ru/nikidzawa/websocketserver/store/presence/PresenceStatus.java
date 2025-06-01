package ru.nikidzawa.websocketserver.store.presence;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PresenceStatus {
    Long userId;
    Boolean isOnline;
    LocalDateTime lastOnlineDate;

    public PresenceStatus(Long userId, Boolean isOnline, LocalDateTime lastOnlineDate) {
        this.userId = userId;
        this.isOnline = isOnline;
        this.lastOnlineDate = lastOnlineDate;
    }
}
