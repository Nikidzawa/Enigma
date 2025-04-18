package ru.nikidzawa.kafka;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

/**
 * @author Nikidzawa
 */
public class KafkaLogoutTransferData {
    Long userId;
    LocalDateTime lastLogoutDate;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDateTime getLastLogoutDate() {
        return lastLogoutDate;
    }

    public void setLastLogoutDate(LocalDateTime lastLogoutDate) {
        this.lastLogoutDate = lastLogoutDate;
    }

    public KafkaLogoutTransferData() {
        this.userId = null;
        this.lastLogoutDate = null;
    }

    @JsonCreator
    public KafkaLogoutTransferData(
            @JsonProperty("userId") Long userId,
            @JsonProperty("lastLogoutDate") LocalDateTime lastLogoutDate) {
        this.userId = userId;
        this.lastLogoutDate = lastLogoutDate;
    }

}
