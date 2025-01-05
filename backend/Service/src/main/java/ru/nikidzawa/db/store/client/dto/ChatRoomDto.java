package ru.nikidzawa.db.store.client.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * В DTO входит id чата + информация о пользователе + сущность последнего сообщения
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChatRoomDto {
    Long userId;
    String userName;
    String userSurname;

    MessageDto lastMessage;

    Long chatId;
}
