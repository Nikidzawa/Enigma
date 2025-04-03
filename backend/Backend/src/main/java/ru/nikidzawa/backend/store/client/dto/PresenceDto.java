package ru.nikidzawa.backend.store.client.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

/**
 * @author Nikidzawa
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PresenceDto {
    Long individualId;
    Boolean isOnline;
    LocalDateTime lastOnlineDate;
}
