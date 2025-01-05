package ru.nikidzawa.db.store.client.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageDto {
    Long id;
    LocalDateTime createdAt;
    String text;
    Long senderId;
}
