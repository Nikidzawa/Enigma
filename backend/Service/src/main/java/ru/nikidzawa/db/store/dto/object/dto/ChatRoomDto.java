package ru.nikidzawa.db.store.dto.object.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomDto {
    Long userId;
    String userName;
    String userSurname;

    MessageDto lastMessage;

    Long chatId;
    Boolean isGroupChat;
    String chatName;
}
