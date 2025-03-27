package ru.nikidzawa.db.store.client.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;
import ru.nikidzawa.db.store.entity.IndividualChatEntity;
import ru.nikidzawa.db.store.entity.IndividualEntity;

/**
 * В DTO входит id чата + информация о пользователе + сущность последнего сообщения
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatRoomDto {
    IndividualDtoShort companion;
    MessageDto lastMessage;
    IndividualChatEntity chat;
}
