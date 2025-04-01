package ru.nikidzawa.backend.store.client.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import ru.nikidzawa.backend.store.entity.IndividualChatEntity;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatRoomDto {
    IndividualDtoShort companion;
    List<MessageDto> messages;
    IndividualChatEntity chat;
}
