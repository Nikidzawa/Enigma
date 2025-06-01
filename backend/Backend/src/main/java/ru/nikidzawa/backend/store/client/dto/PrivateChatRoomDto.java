package ru.nikidzawa.backend.store.client.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PrivateChatRoomDto {
    IndividualDtoShort companion;
    MessageDto lastMessage;
    ChatDto chat;
    Integer unreadCount;
}
