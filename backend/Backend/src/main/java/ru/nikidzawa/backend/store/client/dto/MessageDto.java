package ru.nikidzawa.backend.store.client.dto;

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
    Long senderId;
    Long chatId;
    LocalDateTime sentAt;
    String text;
    Boolean isPinned;
    Boolean isEdited;
    LocalDateTime editedAt;
    Boolean isRead;
}
