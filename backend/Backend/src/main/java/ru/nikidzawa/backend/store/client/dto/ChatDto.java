package ru.nikidzawa.backend.store.client.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatDto {
    Long chatId;
    String chatType;

    Long ownerId;
    Long companionId;
}
