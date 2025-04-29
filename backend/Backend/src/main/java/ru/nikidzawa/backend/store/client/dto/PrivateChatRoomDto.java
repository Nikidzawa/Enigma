package ru.nikidzawa.backend.store.client.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import ru.nikidzawa.backend.store.entity.PrivateChatEntity;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PrivateChatRoomDto {
    IndividualDtoShort companion;
    List<MessageDto> messages;
    PrivateChatEntity chat;
    Integer unreadCount;
}
