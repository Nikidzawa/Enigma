package ru.nikidzawa.db.store.dto.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.nikidzawa.db.store.dto.object.data.ChatRoomData;
import ru.nikidzawa.db.store.dto.object.dto.ChatRoomDto;
import ru.nikidzawa.db.store.dto.object.dto.MessageDto;

@Component
public class ChatRoomDtoFactory {
    public ChatRoomDto convert (ChatRoomData chatRoomData) {
        return ChatRoomDto.builder()
                .userId(chatRoomData.getUserId())
                .userName(chatRoomData.getUserName())
                .userSurname(chatRoomData.getUserSurname())
                .lastMessage(
                        MessageDto.builder()
                                .id(chatRoomData.getLastMessageId())
                                .createdAt(chatRoomData.getLastMessageSendTime())
                                .text(chatRoomData.getLastMessageText())
                                .senderId(chatRoomData.getLastMessageSenderId())
                                .chatId(chatRoomData.getChatId())
                                .build()
                )
                .chatId(chatRoomData.getChatId())
                .chatName(chatRoomData.getChatName())
                .isGroupChat(chatRoomData.getIsGroupChat())
                .build();
    }
}
